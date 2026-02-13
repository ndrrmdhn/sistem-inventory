<?php

namespace App\Http\Controllers;

use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReportController extends Controller
{
    public function __construct(
        private readonly ReportService $reportService
    ) {}

    /**
     * Display stock reports page.
     */
    public function stock(Request $request): Response
    {
        $this->authorize('view any reports');

        $warehouseId = $request->get('warehouse_id');
        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->endOfMonth()->format('Y-m-d'));

        $stockReport = $this->reportService->getStockReport($warehouseId, $startDate, $endDate);
        $warehouses = \App\Models\Warehouse::select('id', 'name')->get();

        return Inertia::render('reports/stock', [
            'stockReport' => $stockReport,
            'warehouses' => $warehouses,
            'filters' => $request->only(['warehouse_id', 'start_date', 'end_date']),
        ]);
    }

    /**
     * Display transaction reports page.
     */
    public function transactions(Request $request): Response
    {
        $this->authorize('view any reports');

        $type = $request->get('type', 'all'); // inbound, outbound, mutation, all
        $warehouseId = $request->get('warehouse_id');
        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->endOfMonth()->format('Y-m-d'));

        $transactionReport = $this->reportService->getTransactionReport($type, $warehouseId, $startDate, $endDate);
        $warehouses = \App\Models\Warehouse::select('id', 'name')->get();

        return Inertia::render('reports/transactions', [
            'transactionReport' => $transactionReport,
            'warehouses' => $warehouses,
            'filters' => $request->only(['type', 'warehouse_id', 'start_date', 'end_date']),
        ]);
    }

    /**
     * Get stock alerts (low stock, out of stock).
     */
    public function alerts(Request $request): Response
    {
        $this->authorize('view any reports');

        $alerts = $this->reportService->getStockAlerts();

        return Inertia::render('reports/alerts', [
            'alerts' => $alerts,
        ]);
    }

    /**
     * Export stock report to PDF/Excel.
     */
    public function exportStock(Request $request)
    {
        $this->authorize('view any reports');

        $warehouseId = $request->get('warehouse_id');
        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->endOfMonth()->format('Y-m-d'));
        $format = $request->get('format', 'pdf');

        return $this->reportService->exportStockReport($warehouseId, $startDate, $endDate, $format);
    }

    /**
     * Export transaction report to PDF/Excel.
     */
    public function exportTransactions(Request $request)
    {
        $this->authorize('view any reports');

        $type = $request->get('type', 'all');
        $warehouseId = $request->get('warehouse_id');
        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->endOfMonth()->format('Y-m-d'));
        $format = $request->get('format', 'pdf');

        return $this->reportService->exportTransactionReport($type, $warehouseId, $startDate, $endDate, $format);
    }
}
