<?php

namespace App\Http\Controllers;

use App\Actions\Transaction\CreateInboundTransactionAction;
use App\Http\Requests\Transaction\StoreInboundRequest;
use App\Models\InboundTransaction;
use App\Models\Product;
use App\Models\Supplier;
use App\Models\Warehouse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InboundController extends Controller
{
    public function __construct(
        private readonly CreateInboundTransactionAction $createInboundAction,
    ) {}

    public function index(Request $request): Response
    {
        $this->authorize('viewAny', InboundTransaction::class);

        $query = InboundTransaction::with(['supplier', 'warehouse', 'product', 'creator'])
            ->when($request->search, function ($q) use ($request) {
                $q->where('code', 'like', "%{$request->search}%")
                    ->orWhereHas('supplier', fn ($sq) => $sq->where('name', 'like', "%{$request->search}%"))
                    ->orWhereHas('product', fn ($pq) => $pq->where('name', 'like', "%{$request->search}%"));
            })
            ->when($request->warehouse_id, function ($q) use ($request) {
                $q->where('warehouse_id', $request->warehouse_id);
            })
            ->when($request->start_date && $request->end_date, function ($q) use ($request) {
                $q->whereBetween('received_date', [$request->start_date, $request->end_date]);
            })
            ->when(! auth()->user()->hasRole('super-admin'), function ($q) {
                $warehouseIds = auth()->user()->warehouses()->pluck('warehouses.id');
                $q->whereIn('warehouse_id', $warehouseIds);
            })
            ->latest();

        $inbounds = $query->paginate(15)->withQueryString();

        $warehouses = auth()->user()->hasRole('super-admin')
            ? Warehouse::active()->get()
            : auth()->user()->warehouses()->active()->get();

        $suppliers = Supplier::active()->get();
        $products = Product::active()->get();

        return Inertia::render('inbound/index', [
            'inbounds' => $inbounds,
            'warehouses' => $warehouses,
            'suppliers' => $suppliers,
            'products' => $products,
            'filters' => $request->only(['search', 'warehouse_id', 'start_date', 'end_date']),
        ]);
    }

    public function store(StoreInboundRequest $request): RedirectResponse
    {
        $this->authorize('create', InboundTransaction::class);

        $validated = $request->validated();

        $transaction = $this->createInboundAction->execute(
            supplierId: $validated['supplier_id'],
            warehouseId: $validated['warehouse_id'],
            productId: $validated['product_id'],
            quantity: $validated['quantity'],
            unitPrice: $validated['unit_price'] ?? 0,
            receivedDate: $validated['received_date'],
            notes: $validated['notes'] ?? null,
        );

        // Get stock change info
        $stockHistory = $transaction->stockHistories()->latest()->first();
        $oldStock = $stockHistory ? $stockHistory->quantity_before : 0;
        $newStock = $stockHistory ? $stockHistory->quantity_after : $validated['quantity'];

        return redirect()->route('inbound.index')
            ->with('success', "Inbound transaction {$transaction->code} berhasil dibuat. Stok: {$oldStock} → {$newStock} (Bertambah {$validated['quantity']})");
    }
}
