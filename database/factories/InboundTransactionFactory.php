<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Supplier;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\InboundTransaction>
 */
class InboundTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = $this->faker->randomFloat(2, 10, 500);
        $unitPrice = $this->faker->randomFloat(2, 1000, 50000);

        return [
            'code' => 'INB-'.$this->faker->unique()->numberBetween(100000, 999999),
            'supplier_id' => Supplier::factory(),
            'warehouse_id' => Warehouse::factory(),
            'product_id' => Product::factory(),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'received_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'notes' => $this->faker->optional(0.6)->sentence(),
            'created_by' => User::factory(),
        ];
    }
}
