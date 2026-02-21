<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Supplier>
 */
class SupplierFactory extends Factory
{
    private static $increment = 1;

    public function definition(): array
    {
        $bakerySuppliers = [
            'PT Sumber Tepung Nusantara',
            'CV Mitra Gula Indonesia',
            'PT Dairy Fresh Indonesia',
            'CV Coklat Premium Indonesia',
            'PT Kopi Arabica Nusantara',
            'CV Ragi Jaya Abadi',
            'PT Kemasan Food Grade',
            'CV Supplier Mentega Sejahtera',
            'PT Susu Segar Indonesia',
            'CV Bahan Kue Makmur',
        ];

        $companyName = fake()->unique()->randomElement($bakerySuppliers);

        return [
            'code' => 'SPL' . str_pad(self::$increment++, 3, '0', STR_PAD_LEFT),

            'name' => $companyName,

            'contact_person' => fake()->name(),

            'phone' => '08' . fake()->numberBetween(1111111111, 9999999999),

            'email' => Str::slug($companyName) . '@supplier.com',

            'address' => fake()->address(),

            'tax_id' => fake()->numerify('##.###.###.#-###.###'),

            'is_active' => fake()->boolean(90),
        ];
    }
}