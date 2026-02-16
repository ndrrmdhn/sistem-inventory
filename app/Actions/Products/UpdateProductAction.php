<?php

namespace App\Actions\Products;

use App\Models\Product;

class UpdateProductAction
{
    /**
     * Update an existing product.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(Product $product, array $input): Product
    {
        if (! $product) {
            throw new \Exception('Produk tidak ditemukan');
        }

        if (isset($input['category_id']) && ! \App\Models\Category::find($input['category_id'])) {
            throw new \Exception('Kategori tidak ditemukan');
        }

        $data = collect($input)->only([
            'category_id', 'name', 'unit', 'min_stock',
            'max_stock', 'price', 'cost', 'description', 'is_active',
        ])->filter(function ($value) {
            return $value !== '' && $value !== null;
        })->toArray();

        $product->update($data);

        return $product->fresh();
    }
}
