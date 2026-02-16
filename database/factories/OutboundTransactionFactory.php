<?php

namespace Database\Factories;

use App\Models\Customer;
use App\Models\Product;
use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OutboundTransaction>
 */
class OutboundTransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = $this->faker->randomFloat(2, 1, 100);
        $unitPrice = $this->faker->randomFloat(2, 5000, 100000);

        return [
            'code' => 'OUT-' . $this->faker->unique()->numberBetween(100000, 999999),
            'customer_id' => Customer::factory(),
            'warehouse_id' => Warehouse::factory(),
            'product_id' => Product::factory(),
            'quantity' => $quantity,
            'unit_price' => $unitPrice,
            'sale_date' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'notes' => $this->faker->optional(0.5)->sentence(),
            'created_by' => User::factory(),
        ];
    }

    /**
     * Indicate that the transaction is a bulk sale.
     */
    public function bulk(): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => $this->faker->randomFloat(2, 50, 500),
        ]);
    }

    /**
     * Indicate that the transaction is a small sale.
     */
    public function retail(): static
    {
        return $this->state(fn (array $attributes) => [
            'quantity' => $this->faker->randomFloat(2, 1, 10),
        ]);
    }
}
