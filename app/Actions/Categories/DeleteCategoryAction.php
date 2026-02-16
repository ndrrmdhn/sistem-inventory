<?php

namespace App\Actions\Categories;

use App\Models\Category;
use Illuminate\Support\Facades\DB;

class DeleteCategoryAction
{
    /**
     * Delete a category (soft delete).
     *
     * @throws \Exception
     */
    public function execute(Category $category): bool
    {
        return DB::transaction(function () use ($category) {
            $category = Category::where('id', $category->id)->lockForUpdate()->firstOrFail();

            if ($category->products()->exists()) {
                throw new \Exception('Tidak dapat menghapus kategori yang memiliki produk. Harap pindahkan atau hapus produk terlebih dahulu.');
            }

            return $category->delete();
        });
    }
}
