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
            // Validasi
            if (empty($ids)) {
                throw new \Exception('Tidak ada ID produk yang dipilih untuk dihapus');
            }

            $products = Product::whereIn('id', $ids)->lockForUpdate()->get();

            return Product::whereIn('id', $ids)->delete();
        });
    }
}
