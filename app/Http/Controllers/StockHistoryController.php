<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\StockHistory;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockHistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', StockHistory::class);

        $query = StockHistory::with(['warehouse', 'product', 'creator'])
            ->when($request->search, function ($q) use ($request) {
                $q->where(function ($subQ) use ($request) {
                    $subQ->where('reference_code', 'like', "%{$request->search}%")
                        ->orWhereHas('product', fn ($productQ) => $productQ->where('name', 'like', "%{$request->search}%"))
                        ->orWhereHas('warehouse', fn ($warehouseQ) => $warehouseQ->where('name', 'like', "%{$request->search}%"));
                });
            })
            ->when($request->warehouse_id, function ($q) use ($request) {
                $q->where('warehouse_id', $request->warehouse_id);
            })
            ->when($request->product_id, function ($q) use ($request) {
                $q->where('product_id', $request->product_id);
            })
            ->when($request->reference_type, function ($q) use ($request) {
                $q->where('reference_type', $request->reference_type);
            })
            ->when($request->start_date && $request->end_date, function ($q) use ($request) {
                $q->whereBetween('created_at', [$request->start_date, $request->end_date]);
            })
            ->when(! auth()->user()->hasRole('super-admin'), function ($q) {
                $warehouseIds = auth()->user()->warehouses()->pluck('warehouses.id');
                $q->whereIn('warehouse_id', $warehouseIds);
            })
            ->latest();

        $stockHistories = $query->paginate(25)->withQueryString();

        $warehouses = auth()->user()->hasRole('super-admin')
            ? Warehouse::active()->get()
            : auth()->user()->warehouses()->active()->get();

        $products = Product::active()->get();

        return Inertia::render('stock-history/index', [
            'stockHistories' => $stockHistories,
            'warehouses' => $warehouses,
            'products' => $products,
            'filters' => $request->only(['search', 'warehouse_id', 'product_id', 'reference_type', 'start_date', 'end_date']),
        ]);
    }
}
