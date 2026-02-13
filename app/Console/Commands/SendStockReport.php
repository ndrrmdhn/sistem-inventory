<?php

namespace App\Console\Commands;

use App\Jobs\SendReportNotification;
use App\Mail\StockReportMail;
use App\Services\ReportService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendStockReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'report:send-stock {period=weekly} {--email=*}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send stock report via email';

    /**
     * Execute the console command.
     */
    public function handle(ReportService $reportService)
    {
        $period = $this->argument('period');
        $emails = $this->option('email');

        if (empty($emails)) {
            $emails = [config('mail.from.address')]; // Default to system email
        }

        $this->info("Generating {$period} stock report...");

        // Calculate date range based on period
        $endDate = now();
        $startDate = match ($period) {
            'weekly' => now()->startOfWeek(),
            'monthly' => now()->startOfMonth(),
            default => now()->startOfWeek(),
        };

        // Get stock report data
        $stockReport = $reportService->getStockReport(null, $startDate->format('Y-m-d'), $endDate->format('Y-m-d'));

        // Calculate summary metrics
        $totalCosts = $stockReport['summary']['total_value'];
        $totalRevenue = $this->calculateRevenue($startDate, $endDate);
        $profit = $totalRevenue - $totalCosts;

        $stockIn = $this->getInboundCount($startDate, $endDate);
        $stockOut = $this->getOutboundCount($startDate, $endDate);

        $warehouses = \App\Models\Warehouse::select('id', 'name')->get()->toArray();
        $totalItems = $stockReport['summary']['total_items'];
        $totalQty = $stockReport['data']->sum('quantity');

        $dateRange = $startDate->format('d/m/Y').' - '.$endDate->format('d/m/Y');

        // Send email to each recipient
        foreach ($emails as $email) {
            $this->info("Sending report to: {$email}");

            Mail::to($email)->send(new StockReportMail(
                period: $period,
                dateRange: $dateRange,
                totalCosts: $totalCosts,
                totalRevenue: $totalRevenue,
                profit: $profit,
                stockIn: $stockIn,
                stockOut: $stockOut,
                warehouses: $warehouses,
                totalItems: $totalItems,
                totalQty: $totalQty
            ));

            // Also send via notification service if configured
            SendReportNotification::dispatch(
                recipient: $email,
                message: "Laporan Stock {$period} GudangKu - {$dateRange}",
                subject: 'Laporan Stock '.($period === 'weekly' ? 'Mingguan' : 'Bulanan'),
                mailableDataJson: json_encode([
                    'period' => $period,
                    'date_range' => $dateRange,
                    'total_costs' => $totalCosts,
                    'total_revenue' => $totalRevenue,
                    'profit' => $profit,
                    'stock_in' => $stockIn,
                    'stock_out' => $stockOut,
                    'warehouses' => $warehouses,
                    'total_items' => $totalItems,
                    'total_qty' => $totalQty,
                ])
            );
        }

        $this->info('Stock report sent successfully to '.count($emails).' recipients.');
    }

    private function calculateRevenue(\Carbon\Carbon $startDate, \Carbon\Carbon $endDate): float
    {
        return \App\Models\OutboundTransaction::whereBetween('sale_date', [
            $startDate->format('Y-m-d'),
            $endDate->format('Y-m-d'),
        ])->sum('total_price');
    }

    private function getInboundCount(\Carbon\Carbon $startDate, \Carbon\Carbon $endDate): int
    {
        return \App\Models\InboundTransaction::whereBetween('receipt_date', [
            $startDate->format('Y-m-d'),
            $endDate->format('Y-m-d'),
        ])->sum('received_qty');
    }

    private function getOutboundCount(\Carbon\Carbon $startDate, \Carbon\Carbon $endDate): int
    {
        return \App\Models\OutboundTransaction::whereBetween('sale_date', [
            $startDate->format('Y-m-d'),
            $endDate->format('Y-m-d'),
        ])->sum('quantity');
    }
}
