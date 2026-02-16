<?php

namespace App\Actions\Categories;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

class BulkDeleteCategoriesAction
{
    /**
     * Delete multiple categories (only those without products).
     *
     * @param  array<int>  $ids
     *
     * @throws \Exception
     */
    public function execute(array $ids): int
    {
        return DB::transaction(function () use ($ids) {
            if (empty($ids)) {
                throw new \Exception('Tidak ada ID kategori yang dipilih untuk dihapus');
            }

            $categories = Category::whereIn('id', $ids)->lockForUpdate()->get();

            $categoriesWithProducts = $categories->filter(fn ($cat) => $cat->products()->exists())
                ->pluck('name')
                ->toArray();

            if (! empty($categoriesWithProducts)) {
                throw new \Exception(
                    'Tidak dapat menghapus kategori yang memiliki produk: '.implode(', ', $categoriesWithProducts).
                    '. Harap pindahkan atau hapus produk terlebih dahulu.'
                );
            }

            return Category::whereIn('id', $ids)->delete();
        });
    }
}
