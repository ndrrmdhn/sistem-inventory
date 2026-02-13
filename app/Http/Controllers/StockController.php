<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Stock;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $query = Stock::with(['warehouse', 'product.category', 'histories' => function ($query) {
            $query->with('user')->latest()->limit(10);
        }]);

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            })->orWhereHas('warehouse', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // Filter warehouse
        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        // Filter product
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        $stocks = $query->paginate(15)->withQueryString();

        return Inertia::render('stocks/index', [
            'stocks' => $stocks,
            'warehouses' => Warehouse::select('id', 'name')->get(),
            'products' => Product::active()->select('id', 'name')->get(),
            'filters' => $request->only(['search', 'warehouse_id', 'product_id']),
        ]);
    }
}
