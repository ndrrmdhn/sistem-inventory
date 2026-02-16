<?php

namespace App\Console\Commands;

use App\Jobs\SendReportNotification;
use App\Mail\LowStockAlertMail;
use App\Models\Stock;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class CheckLowStock extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'check:low-stock {--threshold=10 : Threshold untuk stok rendah} {--channel=email : Channel pengiriman}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Periksa stok rendah dan kirim peringatan';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $threshold = (int) $this->option('threshold');
        $channel = $this->option('channel');

        $this->info("Memeriksa stok rendah dengan threshold {$threshold}...");

        // Get low stock items
        $lowStocks = Stock::with(['product', 'warehouse'])
            ->where('quantity', '<=', $threshold)
            ->where('quantity', '>', 0)
            ->get();

        if ($lowStocks->isEmpty()) {
            $this->info('Tidak ada stok rendah ditemukan.');
            return;
        }

        $this->info("Ditemukan {$lowStocks->count()} item stok rendah.");

        // Group by warehouse
        $stocksByWarehouse = $lowStocks->groupBy('warehouse_id');

        // Send to super-admin and viewer
        $this->sendToGlobalRoles($stocksByWarehouse, $channel);

        // Send to warehouse admins
        $this->sendToWarehouseAdmins($stocksByWarehouse, $channel);

        $this->info('Peringatan stok rendah dikirim.');
    }

    private function sendToGlobalRoles($stocksByWarehouse, $channel)
    {
        $globalUsers = User::role(['super-admin', 'viewer'])->get();

        if ($globalUsers->isEmpty()) {
            return;
        }

        $allLowStocks = collect();
        foreach ($stocksByWarehouse as $warehouseStocks) {
            $allLowStocks = $allLowStocks->merge($warehouseStocks);
        }

        foreach ($globalUsers as $user) {
            $this->sendAlert($user, $allLowStocks, $channel, 'global');
        }
    }

    private function sendToWarehouseAdmins($stocksByWarehouse, $channel)
    {
        foreach ($stocksByWarehouse as $warehouseId => $warehouseStocks) {
            $warehouse = Warehouse::find($warehouseId);
            $admins = $warehouse->users()->whereHas('roles', function ($query) {
                $query->where('name', 'admin');
            })->get();

            foreach ($admins as $admin) {
                $this->sendAlert($admin, $warehouseStocks, $channel, 'warehouse');
            }
        }
    }

    private function sendAlert(User $user, $stocks, $channel, $scope)
    {
        if ($channel === 'email') {
            Mail::to($user->email)->queue(new LowStockAlertMail($stocks, $scope));
        } elseif ($channel === 'notification') {
            $message = $this->buildNotificationMessage($stocks, $scope);
            SendReportNotification::dispatch(
                $user->email,
                'Peringatan Stok Rendah',
                'Peringatan Stok Rendah',
                json_encode(['stocks' => $stocks->toArray(), 'scope' => $scope])
            );
        }
    }

    private function buildNotificationMessage($stocks, $scope)
    {
        $count = $stocks->count();
        $warehouseName = $scope === 'warehouse' ? $stocks->first()->warehouse->name : 'Semua Gudang';

        return "Terdapat {$count} item stok rendah di {$warehouseName}. Periksa segera!";
    }
}
