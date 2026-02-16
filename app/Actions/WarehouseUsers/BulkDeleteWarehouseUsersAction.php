<?php

namespace App\Actions\WarehouseUsers;

use App\Models\WarehouseUser;

class BulkDeleteWarehouseUsersAction
{
    /**
     * Bulk delete warehouse users.
     *
     * @param  array<int>  $ids
     */
    public function execute(array $ids): int
    {
        if (empty($ids)) {
            throw new \Exception('Tidak ada ID yang dipilih untuk dihapus');
        }

        return WarehouseUser::whereIn('id', $ids)->delete();
    }
}
