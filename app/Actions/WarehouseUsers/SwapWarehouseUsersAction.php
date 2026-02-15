<?php

namespace App\Actions\WarehouseUsers;

use App\Models\WarehouseUser;
use Illuminate\Support\Facades\DB;

class SwapWarehouseUsersAction
{
    public function execute(int $warehouseUser1Id, int $warehouseUser2Id): array
    {
        return DB::transaction(function () use ($warehouseUser1Id, $warehouseUser2Id) {
            $wu1 = WarehouseUser::findOrFail($warehouseUser1Id);
            $wu2 = WarehouseUser::findOrFail($warehouseUser2Id);

            // Pastikan berbeda user dan berbeda warehouse
            if ($wu1->user_id === $wu2->user_id || $wu1->warehouse_id === $wu2->warehouse_id) {
                throw new \Exception('Tidak bisa swap assignment yang sama.');
            }

            // Swap warehouse_id
            $tempWarehouseId = $wu1->warehouse_id;
            $wu1->warehouse_id = $wu2->warehouse_id;
            $wu2->warehouse_id = $tempWarehouseId;

            $wu1->save();
            $wu2->save();

            return [$wu1->fresh(), $wu2->fresh()];
        });
    }
}
