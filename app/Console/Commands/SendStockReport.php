<?php

namespace App\Console\Commands;

use App\Jobs\SendReportNotification;
use App\Mail\StockReportMail;
use App\Models\InboundTransaction;
use App\Models\OutboundTransaction;
use App\Models\Stock;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class SendStockReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'send:stock-report {period : mingguan atau bulanan} {--role=super-admin : Role untuk mengirim laporan} {--channel=email : Channel pengiriman}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Kirim laporan stock ke pengguna dengan role tertentu';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $period = $this->argument('period');
        $role = $this->option('role');
        $channel = $this->option('channel');

        $this->info("Mengirim laporan stock {$period} ke role {$role} via {$channel}");

        // Get users with the role
        $users = User::role($role)->get();

        if ($users->isEmpty()) {
            $this->warn("Tidak ada pengguna dengan role {$role}");

            return;
        }

        // Calculate date range
        $dateRange = $this->getDateRange($period);
        [$startDate, $endDate] = $this->getDateRangeDates($period);

        // Get warehouses based on role
        $warehouses = $this->getWarehousesForRole($role, $users->first());
        $warehouseIds = collect($warehouses)->pluck('id')->toArray();

        // Calculate stock data
        $stockData = $this->calculateStockData($warehouseIds, $startDate, $endDate);
        $totalCosts = $stockData['totalCosts'];
        $totalRevenue = $stockData['totalRevenue'];
        $profit = $stockData['profit'];
        $stockIn = $stockData['stockIn'];
        $stockOut = $stockData['stockOut'];
        $totalItems = $stockData['totalItems'];
        $totalQty = $stockData['totalQty'];

        // Kirim ke semua user sekaligus untuk efisiensi
        $this->sendReports($users, $channel, $period, $dateRange, $warehouses, $totalCosts, $totalRevenue, $profit, $stockIn, $stockOut, $totalItems, $totalQty);

        $this->info("Laporan stock dikirim ke {$users->count()} pengguna");
    }

    private function sendReports($users, $channel, $period, $dateRange, $warehouses, $totalCosts, $totalRevenue, $profit, $stockIn, $stockOut, $totalItems, $totalQty)
    {
        if ($channel === 'email') {
            // Gunakan queue untuk efisiensi
            foreach ($users as $user) {
                Mail::to($user->email)->queue(new StockReportMail(
                    $period,
                    $dateRange,
                    $totalCosts,
                    $totalRevenue,
                    $profit,
                    $stockIn,
                    $stockOut,
                    $warehouses,
                    $totalItems,
                    $totalQty
                ));
            }
        } elseif ($channel === 'notification') {
            // Dispatch job untuk setiap user
            foreach ($users as $user) {
                SendReportNotification::dispatch(
                    $user->email,
                    "Laporan Stock {$period}",
                    "Laporan Stock {$period}",
                    json_encode([
                        'period' => $period,
                        'dateRange' => $dateRange,
                        'warehouses' => $warehouses,
                    ])
                );
            }
        }
    }

    private function getDateRange(string $period): string
    {
        $now = now();
        if ($period === 'mingguan') {
            $start = $now->startOfWeek();
            $end = $now->endOfWeek();
        } else {
            $start = $now->startOfMonth();
            $end = $now->endOfMonth();
        }

        return $start->format('d/m/Y').' - '.$end->format('d/m/Y');
    }

    private function getDateRangeDates(string $period): array
    {
        $now = now();
        if ($period === 'mingguan') {
            $start = $now->startOfWeek();
            $end = $now->endOfWeek();
        } else {
            $start = $now->startOfMonth();
            $end = $now->endOfMonth();
        }

        return [$start, $end];
    }

    private function getWarehousesForRole(string $role, User $user): array
    {
        if ($role === 'super-admin' || $role === 'viewer') {
            return Warehouse::all()->toArray();
        } elseif ($role === 'admin') {
            return $user->warehouses->toArray();
        }

        return [];
    }

    private function calculateStockData(array $warehouseIds, $startDate, $endDate): array
    {
        // Total costs from inbound transactions
        $totalCosts = InboundTransaction::whereIn('warehouse_id', $warehouseIds)
            ->whereBetween('received_date', [$startDate, $endDate])
            ->sum('total_price');

        // Total revenue from outbound transactions
        $totalRevenue = OutboundTransaction::whereIn('warehouse_id', $warehouseIds)
            ->whereBetween('sale_date', [$startDate, $endDate])
            ->sum('total_price');

        $profit = $totalRevenue - $totalCosts;

        // Stock in (quantity from inbound)
        $stockIn = InboundTransaction::whereIn('warehouse_id', $warehouseIds)
            ->whereBetween('received_date', [$startDate, $endDate])
            ->sum('quantity');

        // Stock out (quantity from outbound)
        $stockOut = OutboundTransaction::whereIn('warehouse_id', $warehouseIds)
            ->whereBetween('sale_date', [$startDate, $endDate])
            ->sum('quantity');

        // Total items (distinct products in stock)
        $totalItems = Stock::whereIn('warehouse_id', $warehouseIds)
            ->where('quantity', '>', 0)
            ->distinct('product_id')
            ->count('product_id');

        // Total quantity in stock
        $totalQty = Stock::whereIn('warehouse_id', $warehouseIds)
            ->sum('quantity');

        return [
            'totalCosts' => (float) $totalCosts,
            'totalRevenue' => (float) $totalRevenue,
            'profit' => (float) $profit,
            'stockIn' => (float) $stockIn,
            'stockOut' => (float) $stockOut,
            'totalItems' => (int) $totalItems,
            'totalQty' => (float) $totalQty,
        ];
    }
}
