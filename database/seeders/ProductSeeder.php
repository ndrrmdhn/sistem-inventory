<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Product::factory(rand(30, 50))->create();
        $bahanBaku = Category::where('slug', 'bahan-baku')->first();
        $bahanTambahan = Category::where('slug', 'bahan-tambahan')->first();
        $minuman = Category::where('slug', 'minuman')->first();
        $roti = Category::where('slug', 'roti-pastry')->first();
        $kue = Category::where('slug', 'kue-cake')->first();
        $kemasan = Category::where('slug', 'kemasan')->first();

        $products = [

            // ================= BAHAN BAKU =================
            [
                'code' => 'BB001',
                'category_id' => $bahanBaku->id,
                'name' => 'Tepung Terigu Protein Tinggi',
                'unit' => 'kg',
                'min_stock' => 10,
                'max_stock' => 100,
                'price' => 12000,
                'cost' => 9000,
                'description' => 'Bahan utama pembuatan roti',
            ],
            [
                'code' => 'BB002',
                'category_id' => $bahanBaku->id,
                'name' => 'Gula Pasir',
                'unit' => 'kg',
                'min_stock' => 10,
                'max_stock' => 100,
                'price' => 14000,
                'cost' => 11000,
                'description' => 'Gula untuk adonan dan minuman',
            ],
            [
                'code' => 'BB003',
                'category_id' => $bahanBaku->id,
                'name' => 'Mentega',
                'unit' => 'kg',
                'min_stock' => 5,
                'max_stock' => 50,
                'price' => 45000,
                'cost' => 38000,
                'description' => 'Mentega untuk roti & cake',
            ],

            // ================= BAHAN TAMBAHAN =================
            [
                'code' => 'BT001',
                'category_id' => $bahanTambahan->id,
                'name' => 'Ragi Instan',
                'unit' => 'pack',
                'min_stock' => 10,
                'max_stock' => 100,
                'price' => 8000,
                'cost' => 6000,
                'description' => 'Pengembang roti',
            ],
            [
                'code' => 'BT002',
                'category_id' => $bahanTambahan->id,
                'name' => 'Coklat Bubuk',
                'unit' => 'kg',
                'min_stock' => 5,
                'max_stock' => 50,
                'price' => 65000,
                'cost' => 55000,
                'description' => 'Bahan tambahan cake & minuman',
            ],

            // ================= MINUMAN =================
            [
                'code' => 'MN001',
                'category_id' => $minuman->id,
                'name' => 'Kopi Arabica',
                'unit' => 'kg',
                'min_stock' => 5,
                'max_stock' => 30,
                'price' => 150000,
                'cost' => 120000,
                'description' => 'Biji kopi premium',
            ],
            [
                'code' => 'MN002',
                'category_id' => $minuman->id,
                'name' => 'Susu UHT',
                'unit' => 'liter',
                'min_stock' => 10,
                'max_stock' => 100,
                'price' => 18000,
                'cost' => 15000,
                'description' => 'Susu untuk minuman kopi & latte',
            ],

            // ================= ROTI & PASTRY =================
            [
                'code' => 'RP001',
                'category_id' => $roti->id,
                'name' => 'Roti Tawar',
                'unit' => 'pcs',
                'min_stock' => 20,
                'max_stock' => 200,
                'price' => 15000,
                'cost' => 9000,
                'description' => 'Roti tawar fresh bakery',
            ],
            [
                'code' => 'RP002',
                'category_id' => $roti->id,
                'name' => 'Croissant',
                'unit' => 'pcs',
                'min_stock' => 20,
                'max_stock' => 150,
                'price' => 18000,
                'cost' => 11000,
                'description' => 'Pastry berlapis mentega',
            ],

            // ================= KUE & CAKE =================
            [
                'code' => 'KC001',
                'category_id' => $kue->id,
                'name' => 'Brownies Coklat',
                'unit' => 'pcs',
                'min_stock' => 10,
                'max_stock' => 100,
                'price' => 25000,
                'cost' => 15000,
                'description' => 'Brownies coklat lembut',
            ],
            [
                'code' => 'KC002',
                'category_id' => $kue->id,
                'name' => 'Cheesecake',
                'unit' => 'pcs',
                'min_stock' => 5,
                'max_stock' => 50,
                'price' => 30000,
                'cost' => 18000,
                'description' => 'Cheesecake premium',
            ],

            // ================= KEMASAN =================
            [
                'code' => 'KM001',
                'category_id' => $kemasan->id,
                'name' => 'Box Kue Besar',
                'unit' => 'pcs',
                'min_stock' => 50,
                'max_stock' => 500,
                'price' => 2000,
                'cost' => 1500,
                'description' => 'Kemasan kue ukuran besar',
            ],
            [
                'code' => 'KM002',
                'category_id' => $kemasan->id,
                'name' => 'Cup Kopi 12oz',
                'unit' => 'pcs',
                'min_stock' => 100,
                'max_stock' => 1000,
                'price' => 1000,
                'cost' => 700,
                'description' => 'Cup kopi panas',
            ],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}