<?php

namespace App\Actions\Products;

use App\Models\Product;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\DB;

class BulkDeleteProductsAction
{
    public function __construct(
        private readonly FileUploadService $fileUploadService,
    ) {}

    /**
     * Bulk delete products (soft delete).
     *
     * @param  array<int>  $ids
     *
     * @throws \Exception
     */
    public function execute(array $ids): int
    {
        return DB::transaction(function () use ($ids) {
            // Lock for update to prevent race conditions
            $products = Product::whereIn('id', $ids)->lockForUpdate()->get();

            // Soft delete - preserves audit trail
            return Product::whereIn('id', $ids)->delete();
        });
    }
}
