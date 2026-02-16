<?php

namespace App\Actions\Products;

use App\Models\Product;
use App\Services\FileUploadService;
use Illuminate\Support\Facades\DB;

class DeleteProductAction
{
    public function __construct(
        private readonly FileUploadService $fileUploadService,
    ) {}

    /**
     * Delete a product (soft delete).
     *
     * @throws \Exception
     */
    public function execute(Product $product): void
    {
        DB::transaction(function () use ($product) {
            if (! $product) {
                throw new \Exception('Produk tidak ditemukan');
            }

            $product = Product::where('id', $product->getKey())->lockForUpdate()->firstOrFail();

            $product->delete();
        });
    }
}
