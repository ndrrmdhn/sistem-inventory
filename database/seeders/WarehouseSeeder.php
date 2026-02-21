<?php

namespace Database\Seeders;

use App\Models\Warehouse;
use Illuminate\Database\Seeder;

class WarehouseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create specific warehouses
        Warehouse::create([
            'code' => 'WHS-001',
            'name' => 'Gudang Pemalang',
            'address' => 'Jl. Raya Petarukan, Kabupaten Pemalang, Jawa Tengah 52362',
            'phone' => '0811-234-5678',
            'is_active' => true,
        ]);

        Warehouse::create([
            'code' => 'WHS-002',
            'name' => 'Gudang Pekalongan',
            'address' => 'Jl. Jenderal Sudirman , Kota Pekalongan, Jawa Tengah 51111',
            'phone' => '0812-345-6789',
            'is_active' => true,
        ]);

        Warehouse::create([
            'code' => 'WHS-003',
            'name' => 'Gudang Tegal',
            'address' => 'Jl. Perintis Kemerdekaan, Kota Tegal, Jawa Tengah 52122',
            'phone' => '0813-456-7890',
            'is_active' => true,
        ]);

        // Create additional random warehouses
        // Warehouse::factory(2)->create();
    }
}
