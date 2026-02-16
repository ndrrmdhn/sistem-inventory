<?php

declare(strict_types=1);

namespace App\Actions\Stock;

use App\Models\Stock;
use App\Models\StockHistory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UpdateStockAction
{
    public function __construct(
        private readonly Stock $stock,
        private readonly StockHistory $stockHistory,
    ) {}

    public function execute(
        int $warehouseId,
        int $productId,
        float $quantity,
        string $type,
        int $referenceId,
        string $referenceCode,
        ?string $notes = null,
    ): Stock {
        return DB::transaction(function () use ($warehouseId, $productId, $quantity, $type, $referenceId, $referenceCode, $notes) {
            if (! \App\Models\Warehouse::find($warehouseId)) {
                throw new \Exception('Gudang tidak ditemukan');
            }

            if (! \App\Models\Product::find($productId)) {
                throw new \Exception('Produk tidak ditemukan');
            }

            $stock = $this->stock->firstOrCreate(
                [
                    'warehouse_id' => $warehouseId,
                    'product_id' => $productId,
                ],
                [
                    'quantity' => 0,
                    'reserved_qty' => 0,
                    'last_updated' => now(),
                    'updated_by' => (int) (Auth::id() ?? 1),
                ]
            );

            $previousQty = $stock->quantity;
            $newQty = $previousQty + $quantity;

            if ($newQty < 0 && $type !== 'adjustment') {
                throw new \Exception('Stok tidak boleh negatif. Stok saat ini: '.(string) $previousQty.', perubahan: '.(string) $quantity);
            }

            $stock->update([
                'quantity' => $newQty,
                'last_updated' => now(),
                'updated_by' => Auth::id(),
            ]);

            $this->stockHistory->create([
                'stock_id' => $stock->id,
                'warehouse_id' => $warehouseId,
                'product_id' => $productId,
                'previous_qty' => $previousQty,
                'new_qty' => $newQty,
                'change_qty' => $quantity,
                'reference_type' => $type,
                'reference_id' => $referenceId,
                'reference_code' => $referenceCode,
                'notes' => $notes,
                'created_by' => (int) (Auth::id() ?? 1),
            ]);

            return $stock;
        });
    }
}
