<?php

namespace App\Actions\Warehouses;

use App\Models\Warehouse;
use Illuminate\Support\Facades\DB;

class DeleteWarehouseAction
{
    /**
     * Delete a warehouse (soft delete).
     *
     * @throws \Exception
     */
    public function execute(Warehouse $warehouse): bool
    {
        return DB::transaction(function () use ($warehouse) {
            $warehouse = Warehouse::where('id', $warehouse->id)->lockForUpdate()->firstOrFail();


            if ($warehouse->users()->exists()) {
                throw new \Exception('Tidak dapat menghapus gudang yang masih memiliki pengguna terkait.');
            }

            return $warehouse->delete();
        });
    }
}
