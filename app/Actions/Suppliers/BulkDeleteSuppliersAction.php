<?php

namespace App\Actions\Suppliers;

use App\Models\Supplier;
use Illuminate\Support\Facades\DB;

class BulkDeleteSuppliersAction
{
    public function execute(array $ids): int
    {
        return DB::transaction(function () use ($ids) {
            $suppliers = Supplier::whereIn('id', $ids)->lockForUpdate()->get();

            return Supplier::whereIn('id', $ids)->delete();
        });
    }
}
