<?php

namespace App\Actions\Warehouses;

use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class BulkDeleteWarehousesAction
{
    /**
     * Delete multiple warehouses (only those without stock or users).
     *
     * @param  array<int>  $ids
     *
     * @throws \Exception
     */
    public function execute(array $ids): int
    {
        return DB::transaction(function () use ($ids) {
            $warehouses = Warehouse::whereIn('id', $ids)->lockForUpdate()->get();


            $warehousesWithUsers = $warehouses->filter(fn ($wh) => $wh->users()->exists())
                ->pluck('name')
                ->toArray();

            if (! empty($warehousesWithUsers)) {
                throw new \Exception(
                    'Tidak dapat menghapus gudang yang masih memiliki pengguna terkait: '.implode(', ', $warehousesWithUsers).
                    '. Silakan lepaskan pengguna terlebih dahulu.'
                );
            }

            return Warehouse::whereIn('id', $ids)->delete();
        });
    }
}
