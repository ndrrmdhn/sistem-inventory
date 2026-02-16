<?php

namespace App\Services;

use App\Exports\StockReportExport;
use App\Exports\TransactionReportExport;
use App\Models\InboundTransaction;
use App\Models\OutboundTransaction;
use App\Models\Stock;
use App\Models\StockMutation;
use App\Models\Warehouse;
use Maatwebsite\Excel\Facades\Excel;
use Spatie\LaravelPdf\Facades\Pdf;

class ReportService
{
    /**
     * Get stock report data.
     */
    public function getStockReport(?int $warehouseId, string $startDate, string $endDate): array
    {
        $query = Stock::with(['product', 'warehouse'])
            ->whereHas('product', function ($q) {
                $q->where('is_active', true)->whereNull('deleted_at');
            });

        if ($warehouseId) {
            $query->where('warehouse_id', $warehouseId);
        }

        $stocks = $query->get();

        $totalValue = 0;
        $lowStockItems = 0;
        $outOfStockItems = 0;

        $stockData = $stocks->map(function ($stock) use (&$totalValue, &$lowStockItems, &$outOfStockItems) {
            $value = $stock->quantity * $stock->product->cost;
            $totalValue += $value;

            $isLowStock = $stock->quantity <= $stock->product->min_stock && $stock->product->min_stock > 0;
            $isOutOfStock = $stock->quantity <= 0;

            if ($isLowStock) {
                $lowStockItems++;
            }
            if ($isOutOfStock) {
                $outOfStockItems++;
            }

            return [
                'warehouse_name' => $stock->warehouse->name,
                'product_code' => $stock->product->code,
                'product_name' => $stock->product->name,
                'unit' => $stock->product->unit,
                'quantity' => $stock->quantity,
                'reserved_qty' => $stock->reserved_qty,
                'available_qty' => $stock->available_qty,
                'min_stock' => $stock->product->min_stock,
                'max_stock' => $stock->product->max_stock,
                'cost' => $stock->product->cost,
                'value' => $value,
                'status' => $isOutOfStock ? 'out_of_stock' : ($isLowStock ? 'low_stock' : 'normal'),
            ];
        });

        // Group by warehouse if no specific warehouse selected
        if (! $warehouseId) {
            $stockData = $stockData->groupBy('warehouse_name');
        }

        return [
            'data' => $stockData,
            'summary' => [
                'total_items' => $stocks->count(),
                'total_value' => $totalValue,
                'low_stock_items' => $lowStockItems,
                'out_of_stock_items' => $outOfStockItems,
                'warehouses_count' => $warehouseId ? 1 : $stocks->pluck('warehouse.name')->unique()->count(),
            ],
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ];
    }

    /**
     * Get transaction report data.
     */
    public function getTransactionReport(string $type, ?int $warehouseId, string $startDate, string $endDate): array
    {
        $data = [];

        if ($type === 'all' || $type === 'inbound') {
            $inbound = InboundTransaction::with(['product', 'warehouse', 'supplier'])
                ->when($warehouseId, fn ($q) => $q->where('warehouse_id', $warehouseId))
                ->whereBetween('received_date', [$startDate, $endDate])
                ->get()
                ->map(function ($transaction) {
                    return [
                        'type' => 'inbound',
                        'code' => $transaction->code,
                        'date' => $transaction->received_date,
                        'warehouse' => $transaction->warehouse->name,
                        'product' => $transaction->product->name,
                        'supplier' => $transaction->supplier->name,
                        'quantity' => $transaction->quantity,
                        'unit_price' => $transaction->unit_price,
                        'total_price' => $transaction->quantity * $transaction->unit_price,
                    ];
                });
            $data = array_merge($data, $inbound->toArray());
        }

        if ($type === 'all' || $type === 'outbound') {
            $outbound = OutboundTransaction::with(['product', 'warehouse', 'customer'])
                ->when($warehouseId, fn ($q) => $q->where('warehouse_id', $warehouseId))
                ->whereBetween('sale_date', [$startDate, $endDate])
                ->get()
                ->map(function ($transaction) {
                    return [
                        'type' => 'outbound',
                        'code' => $transaction->code,
                        'date' => $transaction->sale_date,
                        'warehouse' => $transaction->warehouse->name,
                        'product' => $transaction->product->name,
                        'customer' => $transaction->customer->name,
                        'quantity' => $transaction->quantity,
                        'unit_price' => $transaction->unit_price,
                        'total_price' => $transaction->total_price,
                    ];
                });
            $data = array_merge($data, $outbound->toArray());
        }

        if ($type === 'all' || $type === 'mutation') {
            $mutations = StockMutation::with(['product', 'fromWarehouse', 'toWarehouse'])
                ->when($warehouseId, function ($q) use ($warehouseId) {
                    $q->where('from_warehouse', $warehouseId)->orWhere('to_warehouse', $warehouseId);
                })
                ->whereBetween('sent_at', [$startDate, $endDate])
                ->get()
                ->map(function ($mutation) {
                    return [
                        'type' => 'mutation',
                        'code' => $mutation->code,
                        'date' => $mutation->sent_at,
                        'from_warehouse' => $mutation->fromWarehouse->name,
                        'to_warehouse' => $mutation->toWarehouse->name,
                        'product' => $mutation->product->name,
                        'quantity' => $mutation->quantity,
                        'received_qty' => $mutation->received_qty,
                        'status' => $mutation->status,
                    ];
                });
            $data = array_merge($data, $mutations->toArray());
        }

        // Sort by date
        usort($data, function ($a, $b) {
            return strtotime($b['date']) - strtotime($a['date']);
        });

        $summary = $this->calculateTransactionSummary($data);

        return [
            'data' => $data,
            'summary' => $summary,
            'period' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
        ];
    }

    /**
     * Get stock alerts (low stock and out of stock).
     */
    public function getStockAlerts(): array
    {
        $lowStock = Stock::with(['product', 'warehouse'])
            ->join('products', 'stocks.product_id', '=', 'products.id')
            ->where('products.is_active', true)
            ->where('products.min_stock', '>', 0)
            ->whereRaw('stocks.quantity <= products.min_stock')
            ->where('stocks.quantity', '>', 0)
            ->select('stocks.*')
            ->get()
            ->map(function ($stock) {
                return [
                    'type' => 'low_stock',
                    'warehouse' => $stock->warehouse->name,
                    'product' => $stock->product->name,
                    'current_qty' => $stock->quantity,
                    'min_stock' => $stock->product->min_stock,
                    'unit' => $stock->product->unit,
                ];
            });

        $outOfStock = Stock::with(['product', 'warehouse'])
            ->whereHas('product', function ($q) {
                $q->where('is_active', true);
            })
            ->where('quantity', '<=', 0)
            ->get()
            ->map(function ($stock) {
                return [
                    'type' => 'out_of_stock',
                    'warehouse' => $stock->warehouse->name,
                    'product' => $stock->product->name,
                    'current_qty' => $stock->quantity,
                    'min_stock' => $stock->product->min_stock,
                    'unit' => $stock->product->unit,
                ];
            });

        return [
            'low_stock' => $lowStock,
            'out_of_stock' => $outOfStock,
            'total_alerts' => $lowStock->count() + $outOfStock->count(),
        ];
    }

    /**
     * Calculate transaction summary.
     */
    private function calculateTransactionSummary(array $transactions): array
    {
        $summary = [
            'total_inbound' => 0,
            'total_outbound' => 0,
            'total_mutations' => 0,
            'total_inbound_value' => 0,
            'total_outbound_value' => 0,
            'net_movement' => 0,
        ];

        foreach ($transactions as $transaction) {
            switch ($transaction['type']) {
                case 'inbound':
                    $summary['total_inbound'] += $transaction['quantity'];
                    $summary['total_inbound_value'] += $transaction['total_price'];
                    $summary['net_movement'] += $transaction['quantity'];
                    break;
                case 'outbound':
                    $summary['total_outbound'] += $transaction['quantity'];
                    $summary['total_outbound_value'] += $transaction['total_price'];
                    $summary['net_movement'] -= $transaction['quantity'];
                    break;
                case 'mutation':
                    $summary['total_mutations'] += $transaction['quantity'];
                    break;
            }
        }

        return $summary;
    }

    /**
     * Export stock report (placeholder for PDF/Excel export).
     */
    public function exportStockReport(?int $warehouseId, string $startDate, string $endDate, string $format)
    {
        if ($format === 'excel') {
            $filename = 'stock_report_'.str_replace('-', '_', $startDate).'_to_'.str_replace('-', '_', $endDate).'.xlsx';

            return Excel::download(new StockReportExport($warehouseId, $startDate, $endDate), $filename);
        }

        if ($format === 'pdf') {
            $stockReport = $this->getStockReport($warehouseId, $startDate, $endDate);
            $warehouse = $warehouseId ? Warehouse::find($warehouseId) : null;

            $filename = 'stock_report_'.str_replace('-', '_', $startDate).'_to_'.str_replace('-', '_', $endDate).'.pdf';

            return Pdf::view('reports.stock', compact('stockReport', 'warehouse', 'warehouseId'))
                ->format('a4')
                ->download($filename);
        }

        return response()->json(['message' => 'Unsupported format']);
    }

    /**
     * Export transaction report (placeholder for PDF/Excel export).
     */
    public function exportTransactionReport(string $type, ?int $warehouseId, string $startDate, string $endDate, string $format)
    {
        if ($format === 'excel') {
            $filename = 'transaction_report_'.$type.'_'.str_replace('-', '_', $startDate).'_to_'.str_replace('-', '_', $endDate).'.xlsx';

            return Excel::download(new TransactionReportExport($type, $warehouseId, $startDate, $endDate), $filename);
        }

        if ($format === 'pdf') {
            $transactionReport = $this->getTransactionReport($type, $warehouseId, $startDate, $endDate);
            $warehouse = $warehouseId ? Warehouse::find($warehouseId) : null;

            $filename = 'transaction_report_'.$type.'_'.str_replace('-', '_', $startDate).'_to_'.str_replace('-', '_', $endDate).'.pdf';

            return Pdf::view('reports.transactions', compact('transactionReport', 'warehouse', 'warehouseId', 'type'))
                ->format('a4')
                ->download($filename);
        }

        return response()->json(['message' => 'Unsupported format']);
    }
}
