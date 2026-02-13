<?php

namespace App\Http\Controllers;

use App\Actions\Opname\ApproveOpnameAction;
use App\Models\Opname;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OpnameController extends Controller
{
    public function __construct(
        private readonly ApproveOpnameAction $approveOpnameAction,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Opname::class);

        $query = Opname::with(['warehouse', 'product', 'creator'])
            ->when($request->search, function ($q) use ($request) {
                $q->where('code', 'like', "%{$request->search}%")
                    ->orWhereHas('product', fn ($pq) => $pq->where('name', 'like', "%{$request->search}%"));
            })
            ->when($request->warehouse_id, function ($q) use ($request) {
                $q->where('warehouse_id', $request->warehouse_id);
            })
            ->when($request->difference_type, function ($q) use ($request) {
                $q->where('difference_type', $request->difference_type);
            })
            ->when(! auth()->user()->hasRole('super-admin'), function ($q) {
                $warehouseIds = auth()->user()->warehouses()->pluck('warehouses.id');
                $q->whereIn('warehouse_id', $warehouseIds);
            })
            ->latest();

        $opnames = $query->paginate(15)->withQueryString();

        $warehouses = auth()->user()->hasRole('super-admin')
            ? Warehouse::active()->get()
            : auth()->user()->warehouses()->active()->get();

        $products = Product::active()->get();

        // Get stocks for product filtering based on accessible warehouses
        $stocks = \App\Models\Stock::with(['product', 'warehouse'])
            ->whereHas('warehouse', function ($q) use ($warehouses) {
                $q->whereIn('id', $warehouses->pluck('id'));
            })
            ->where('quantity', '>=', 0) // Include products with 0 stock for opname
            ->get();

        return Inertia::render('opname/index', [
            'opnames' => $opnames,
            'warehouses' => $warehouses,
            'products' => $products,
            'stocks' => $stocks,
            'filters' => $request->only(['search', 'warehouse_id', 'difference_type', 'start_date', 'end_date']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Opname::class);

        $request->validate([
            'warehouse_id' => 'required|exists:warehouses,id',
            'product_id' => 'required|exists:products,id',
            'physical_qty' => 'required|numeric|min:0',
            'opname_date' => 'required|date|before_or_equal:today',
            'notes' => 'nullable|string|max:500',
        ]);

        // Check if opname for same product and date already exists
        $existingOpname = Opname::where('warehouse_id', $request->warehouse_id)
            ->where('product_id', $request->product_id)
            ->whereDate('opname_date', $request->opname_date)
            ->exists();

        if ($existingOpname) {
            throw ValidationException::withMessages([
                'product_id' => 'Opname untuk produk ini pada tanggal yang sama sudah ada.',
            ]);
        }

        // Get current system quantity
        $stock = \App\Models\Stock::where('warehouse_id', $request->warehouse_id)
            ->where('product_id', $request->product_id)
            ->first();

        $systemQty = $stock ? $stock->quantity : 0;
        $physicalQty = $request->physical_qty;
        $differenceQty = $physicalQty - $systemQty;
        $differenceType = $differenceQty > 0 ? 'lebih' : ($differenceQty < 0 ? 'kurang' : 'sama');

        // Generate code
        $date = now()->format('Ymd');
        $prefix = 'OP';
        $lastOpname = Opname::where('code', 'like', "{$prefix}-{$date}-%")
            ->orderBy('code', 'desc')
            ->first();

        if ($lastOpname) {
            $lastNumber = (int) substr($lastOpname->code, -3);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        $code = sprintf('%s-%s-%03d', $prefix, $date, $newNumber);

        Opname::create([
            'code' => $code,
            'warehouse_id' => $request->warehouse_id,
            'product_id' => $request->product_id,
            'system_qty' => $systemQty,
            'physical_qty' => $physicalQty,
            'difference_qty' => abs($differenceQty),
            'difference_type' => $differenceType,
            'status' => 'draft',
            'notes' => $request->notes,
            'opname_date' => $request->opname_date,
            'created_by' => auth()->id() ?? 1,
        ]);

        return redirect()->route('opname.index')
            ->with('success', 'Opname berhasil dibuat.');
    }

    public function approve(Request $request, Opname $opname): RedirectResponse
    {
        $this->authorize('approve', $opname);

        try {
            $this->approveOpnameAction->execute($opname->id);

            return redirect()->route('opname.index')
                ->with('success', 'Opname berhasil diapprove dan stok disesuaikan.');
        } catch (Exception $e) {
            return redirect()->back()
                ->with('error', "Gagal mengapprove opname: {$e->getMessage()}");
        }
    }
}
