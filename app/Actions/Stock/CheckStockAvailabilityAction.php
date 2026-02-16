<?php

declare(strict_types=1);

namespace App\Actions\Stock;

use App\Models\Stock;

class CheckStockAvailabilityAction
{
    public function __construct(
        private readonly Stock $stock,
    ) {}

    public function execute(int $warehouseId, int $productId, float $requestedQty): bool
    {
        if (! \App\Models\Warehouse::find($warehouseId)) {
            throw new \Exception('Gudang tidak ditemukan');
        }

        if (! \App\Models\Product::find($productId)) {
            throw new \Exception('Produk tidak ditemukan');
        }

        if ($requestedQty <= 0) {
            throw new \Exception('Jumlah diminta harus lebih besar dari 0');
        }

        $stock = $this->stock
            ->where('warehouse_id', $warehouseId)
            ->where('product_id', $productId)
            ->first();

        if (! $stock) {
            return false;
        }

        return $stock->available_qty >= $requestedQty;
    }

    public function getStockInfo(int $warehouseId, int $productId): array
    {
        if (! \App\Models\Warehouse::find($warehouseId)) {
            throw new \Exception('Gudang tidak ditemukan');
        }

        if (! \App\Models\Product::find($productId)) {
            throw new \Exception('Produk tidak ditemukan');
        }

        $stock = $this->stock
            ->where('warehouse_id', $warehouseId)
            ->where('product_id', $productId)
            ->first();

        if (! $stock) {
            return [
                'available' => 0.0,
                'current' => 0.0,
                'reserved' => 0.0,
                'is_available' => false,
            ];
        }

        return [
            'available' => $stock->available_qty,
            'current' => $stock->quantity,
            'reserved' => $stock->reserved_qty,
            'is_available' => true,
        ];
    }
}
