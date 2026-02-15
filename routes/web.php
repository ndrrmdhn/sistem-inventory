<?php

use App\Http\Controllers\Settings\ProfileController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('auth/google/redirect', [ProfileController::class, 'google_redirect'])
    ->middleware('guest')
    ->name('google.redirect');
Route::get('auth/google/callback', [ProfileController::class, 'google_callback'])
    ->middleware('guest')
    ->name('google.callback');

Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::prefix('dashboard')->middleware(['auth', 'verified'])->group(function () {

    Route::middleware(['throttle:bulk'])->group(function () {
        Route::delete('employees/bulk-destroy', [\App\Http\Controllers\EmployeeController::class, 'bulkDestroy'])
            ->name('employees.bulk-destroy');

        Route::delete('categories/bulk-destroy', [\App\Http\Controllers\CategoryController::class, 'bulkDestroy'])
            ->name('categories.bulk-destroy');

        Route::delete('warehouses/bulk-destroy', [\App\Http\Controllers\WarehouseController::class, 'bulkDestroy'])
            ->name('warehouses.bulk-destroy');

        Route::delete('warehouse-users/bulk-destroy', [\App\Http\Controllers\WarehouseUserController::class, 'bulkDestroy'])
            ->name('warehouse-users.bulk-destroy');

        Route::delete('products/bulk-destroy', [\App\Http\Controllers\ProductController::class, 'bulkDestroy'])
            ->name('products.bulk-destroy');

        Route::delete('suppliers/bulk-destroy', [\App\Http\Controllers\SupplierController::class, 'bulkDestroy'])
            ->name('suppliers.bulk-destroy');

        Route::delete('customers/bulk-destroy', [\App\Http\Controllers\CustomerController::class, 'bulkDestroy'])
            ->name('customers.bulk-destroy');

    });

    // CRUD operations - Rate limit: 30 per minute
    Route::middleware(['throttle:crud'])->group(function () {
        Route::resource('employees', \App\Http\Controllers\EmployeeController::class)
            ->parameters(['employees' => 'employee'])
            ->except(['create', 'edit']);

        Route::resource('categories', \App\Http\Controllers\CategoryController::class)
            ->parameters(['categories' => 'category'])
            ->except(['create', 'edit']);

        Route::resource('warehouses', \App\Http\Controllers\WarehouseController::class)
            ->parameters(['warehouses' => 'warehouse'])
            ->except(['create', 'edit']);

        Route::resource('warehouse-users', \App\Http\Controllers\WarehouseUserController::class)
            ->parameters(['warehouse-users' => 'warehouseUser'])
            ->except(['create', 'edit', 'update']);

        Route::post('warehouse-users/swap', [\App\Http\Controllers\WarehouseUserController::class, 'swap'])
            ->name('warehouse-users.swap');

        Route::resource('products', \App\Http\Controllers\ProductController::class)
            ->parameters(['products' => 'product'])
            ->except(['create', 'edit']);

        Route::resource('suppliers', \App\Http\Controllers\SupplierController::class)
            ->parameters(['suppliers' => 'supplier'])
            ->except(['create', 'edit']);

        Route::resource('customers', \App\Http\Controllers\CustomerController::class)
            ->parameters(['customers' => 'customer'])
            ->except(['create', 'edit']);

        // Stock Management
        Route::prefix('stocks')->name('stocks.')->group(function () {
            Route::get('/', [\App\Http\Controllers\StockController::class, 'index'])->name('index');
        });

        // Inbound Transactions
        Route::prefix('inbound')->name('inbound.')->group(function () {
            Route::get('/', [\App\Http\Controllers\InboundController::class, 'index'])->name('index');
            Route::post('/', [\App\Http\Controllers\InboundController::class, 'store'])->name('store');
            Route::put('/{transaction}', [\App\Http\Controllers\InboundController::class, 'update'])->name('update');
            Route::delete('/{transaction}', [\App\Http\Controllers\InboundController::class, 'destroy'])->name('destroy');
        });

        // Outbound Transactions
        Route::prefix('outbound')->name('outbound.')->group(function () {
            Route::get('/', [\App\Http\Controllers\OutboundController::class, 'index'])->name('index');
            Route::post('/', [\App\Http\Controllers\OutboundController::class, 'store'])->name('store');
            Route::put('/{transaction}', [\App\Http\Controllers\OutboundController::class, 'update'])->name('update');
            Route::delete('/{transaction}', [\App\Http\Controllers\OutboundController::class, 'destroy'])->name('destroy');
        });

        // Opname
        Route::prefix('opname')->name('opname.')->group(function () {
            Route::get('/', [\App\Http\Controllers\OpnameController::class, 'index'])->name('index');
            Route::post('/', [\App\Http\Controllers\OpnameController::class, 'store'])->name('store');
            Route::post('/{opname}/approve', [\App\Http\Controllers\OpnameController::class, 'approve'])->name('approve');
        });
        Route::prefix('mutations')->name('mutations.')->group(function () {
            Route::get('/', [\App\Http\Controllers\MutationController::class, 'index'])->name('index');
            Route::get('/{mutation}', [\App\Http\Controllers\MutationController::class, 'show'])->name('show');
            Route::post('/', [\App\Http\Controllers\MutationController::class, 'store'])->name('store');
            Route::put('/{mutation}', [\App\Http\Controllers\MutationController::class, 'update'])->name('update');
            Route::delete('/{mutation}', [\App\Http\Controllers\MutationController::class, 'destroy'])->name('destroy');
            Route::post('/{mutation}/receive', [\App\Http\Controllers\MutationController::class, 'receive'])->name('receive');
            Route::post('/{mutation}/reject', [\App\Http\Controllers\MutationController::class, 'reject'])->name('reject');
        });

        // Stock History
        Route::prefix('stock-history')->name('stock-history.')->group(function () {
            Route::get('/', [\App\Http\Controllers\StockHistoryController::class, 'index'])->name('index');
        });

        // Stock Management
        Route::prefix('stocks')->name('stocks.')->group(function () {
            Route::get('/', [\App\Http\Controllers\StockController::class, 'index'])->name('index');
        });

        // Reports
        Route::prefix('reports')->name('reports.')->group(function () {
            Route::get('/stock', [\App\Http\Controllers\ReportController::class, 'stock'])->name('stock');
            Route::get('/transactions', [\App\Http\Controllers\ReportController::class, 'transactions'])->name('transactions');
            Route::get('/alerts', [\App\Http\Controllers\ReportController::class, 'alerts'])->name('alerts');
            Route::get('/stock/export', [\App\Http\Controllers\ReportController::class, 'exportStock'])->name('stock.export');
            Route::get('/transactions/export', [\App\Http\Controllers\ReportController::class, 'exportTransactions'])->name('transactions.export');
        });

    });

});

require __DIR__.'/settings.php';
