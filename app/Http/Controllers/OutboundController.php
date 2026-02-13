<?php

namespace App\Http\Controllers;

use App\Actions\Transaction\CreateOutboundTransactionAction;
use App\Http\Requests\Transaction\StoreOutboundRequest;
use App\Models\Customer;
use App\Models\OutboundTransaction;
use App\Models\Product;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OutboundController extends Controller
{
    public function __construct(
        private readonly CreateOutboundTransactionAction $createOutboundAction,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', OutboundTransaction::class);

        $query = OutboundTransaction::with(['customer', 'warehouse', 'product', 'creator'])
            ->when($request->search, function ($q) use ($request) {
                $q->where('code', 'like', "%{$request->search}%")
                    ->orWhereHas('customer', fn ($cq) => $cq->where('name', 'like', "%{$request->search}%"))
                    ->orWhereHas('product', fn ($pq) => $pq->where('name', 'like', "%{$request->search}%"));
            })
            ->when($request->warehouse_id, function ($q) use ($request) {
                $q->where('warehouse_id', $request->warehouse_id);
            })
            ->when($request->start_date && $request->end_date, function ($q) use ($request) {
                $q->whereBetween('sale_date', [$request->start_date, $request->end_date]);
            })
            ->when(! auth()->user()->hasRole('super-admin'), function ($q) {
                $warehouseIds = auth()->user()->warehouses()->pluck('warehouses.id');
                $q->whereIn('warehouse_id', $warehouseIds);
            })
            ->latest();

        $outbounds = $query->paginate(15)->withQueryString();

        $warehouses = auth()->user()->hasRole('super-admin')
            ? Warehouse::active()->get()
            : auth()->user()->warehouses()->active()->get();

        $customers = Customer::active()->get();
        $products = Product::active()->get();

        // Get stocks for product filtering
        $stocks = \App\Models\Stock::with(['product', 'warehouse'])
            ->whereHas('warehouse', function ($q) use ($warehouses) {
                $q->whereIn('id', $warehouses->pluck('id'));
            })
            ->where('quantity', '>', 0)
            ->get();

        return Inertia::render('outbound/index', [
            'outbounds' => $outbounds,
            'warehouses' => $warehouses,
            'customers' => $customers,
            'products' => $products,
            'stocks' => $stocks,
            'filters' => $request->only(['search', 'warehouse_id', 'start_date', 'end_date']),
        ]);
    }

    public function store(StoreOutboundRequest $request): RedirectResponse
    {
        $this->authorize('create', OutboundTransaction::class);

        $validated = $request->validated();

        // Handle file upload
        $attachmentPath = null;
        if ($request->hasFile('attachment')) {
            $attachmentPath = $request->file('attachment')->store('attachments/outbound', 'public');
        }

        try {
            $transaction = $this->createOutboundAction->execute(
                customerId: $validated['customer_id'],
                warehouseId: $validated['warehouse_id'],
                productId: $validated['product_id'],
                quantity: $validated['quantity'],
                unitPrice: $validated['unit_price'] ?? 0,
                saleDate: $validated['sale_date'],
                notes: $validated['notes'] ?? null,
                attachment: $attachmentPath,
            );

            // Get stock change info
            $stockHistory = $transaction->stockHistories()->latest()->first();
            $oldStock = $stockHistory ? $stockHistory->quantity_before : $validated['quantity'];
            $newStock = $stockHistory ? $stockHistory->quantity_after : 0;

            return redirect()->route('outbound.index')
                ->with('success', "Outbound transaction {$transaction->code} berhasil dibuat. Stok: {$oldStock} → {$newStock} (Berkurang {$validated['quantity']})");
        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        }
    }
}
