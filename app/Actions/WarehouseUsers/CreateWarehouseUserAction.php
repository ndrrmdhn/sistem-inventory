<?php

namespace App\Actions\WarehouseUsers;

use App\Models\WarehouseUser;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CreateWarehouseUserAction
{
    public function execute(array $input): WarehouseUser
    {
        return DB::transaction(function () use ($input) {
            $warehouseId = $input['warehouse_id'];
            $userId = $input['user_id'];

            if (! \App\Models\Warehouse::find($warehouseId)) {
                throw new \Exception('Gudang tidak ditemukan');
            }

            if (! \App\Models\User::find($userId)) {
                throw new \Exception('Pengguna tidak ditemukan');
            }

            $assignedBy = $input['assigned_by'] ?? Auth::id();
            $assignedAt = $input['assigned_at'] ?? now();
            $isPrimary = $input['is_primary'] ?? true;

            $existing = WarehouseUser::withTrashed()
                ->where('warehouse_id', $warehouseId)
                ->where('user_id', $userId)
                ->lockForUpdate()
                ->first();

            if ($existing) {
                if ($existing->trashed()) {
                    $existing->restore();
                }

                $existing->update([
                    'assigned_by' => $assignedBy,
                    'assigned_at' => $assignedAt,
                    'is_primary' => $isPrimary,
                ]);

                return $existing->fresh();
            }

            return WarehouseUser::create([
                'user_id' => $userId,
                'warehouse_id' => $warehouseId,
                'assigned_by' => $assignedBy,
                'assigned_at' => $assignedAt,
                'is_primary' => $isPrimary,
            ]);
        });
    }
}
