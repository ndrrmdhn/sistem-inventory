<?php

namespace App\Actions\Products;

use App\Models\Product;
use App\Services\FileUploadService;

class UpdateProductAction
{
    public function __construct(
        private readonly FileUploadService $fileUploadService,
    ) {}

    /**
     * Update an existing product.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(Product $product, array $input): Product
    {
        // Gunakan collect untuk mempermudah pembersihan data opsional
        $data = collect($input)->only([
            'category_id', 'name', 'unit', 'min_stock',
            'max_stock', 'price', 'cost', 'description', 'is_active'
        ])->filter(function ($value) {
            // Hanya update jika nilainya tidak kosong (tapi 0 tetap boleh)
            return $value !== '' && $value !== null;
        })->toArray();

        $product->update($data);

        return $product->fresh();
    }
}
