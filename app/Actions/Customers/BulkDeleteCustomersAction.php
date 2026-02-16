<?php

namespace App\Actions\Customers;

use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class BulkDeleteCustomersAction
{
    /**
     * Bulk delete customers (soft delete).
     *
     * @param  array<int>  $ids
     *
     * @throws \Exception
     */
    public function execute(array $ids): int
    {
        return DB::transaction(function () use ($ids) {
            if (empty($ids)) {
                throw new \Exception('Tidak ada ID pelanggan yang dipilih untuk dihapus');
            }

            $customers = Customer::whereIn('id', $ids)->lockForUpdate()->get();

            return Customer::whereIn('id', $ids)->delete();
        });
    }
}
