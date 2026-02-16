<?php

declare(strict_types=1);

namespace App\Actions\Transaction;

use App\Actions\Stock\CheckStockAvailabilityAction;
use App\Actions\Stock\UpdateStockAction;
use App\Models\StockMutation;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateMutationAction
{
    public function __construct(
        private readonly UpdateStockAction $updateStockAction,
        private readonly CheckStockAvailabilityAction $checkStockAvailabilityAction,
        private readonly StockMutation $stockMutation,
    ) {}

    public function send(
        int $fromWarehouseId,
        int $toWarehouseId,
        int $productId,
        float $quantity,
        ?string $notes = null,
    ): StockMutation {
        return DB::transaction(function () use ($fromWarehouseId, $toWarehouseId, $productId, $quantity, $notes) {
            try {
                if ($quantity <= 0) {
                    throw new Exception('Jumlah harus lebih besar dari 0');
                }

                if ($fromWarehouseId === $toWarehouseId) {
                    throw new Exception('Gudang asal dan tujuan tidak boleh sama');
                }

                if (! \App\Models\Warehouse::find($fromWarehouseId)) {
                    throw new Exception('Gudang asal tidak ditemukan');
                }

                if (! \App\Models\Warehouse::find($toWarehouseId)) {
                    throw new Exception('Gudang tujuan tidak ditemukan');
                }

                if (! \App\Models\Product::find($productId)) {
                    throw new Exception('Produk tidak ditemukan');
                }

                $stockInfo = $this->checkStockAvailabilityAction->getStockInfo($fromWarehouseId, $productId);

                if (! $stockInfo['is_available'] || $stockInfo['available'] < $quantity) {
                    throw ValidationException::withMessages([
                        'quantity' => 'Stok gudang asal tidak cukup. Tersedia: '.$stockInfo['available'].', diminta: '.$quantity,
                    ]);
                }

                $code = $this->generateMutationCode();

                $mutation = $this->stockMutation->create([
                    'code' => $code,
                    'from_warehouse' => $fromWarehouseId,
                    'to_warehouse' => $toWarehouseId,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'received_qty' => 0,
                    'damaged_qty' => 0,
                    'status' => 'dikirim',
                    'sent_at' => now(),
                    'notes' => $notes,
                    'created_by' => Auth::id(),
                ]);

                return $mutation->load(['fromWarehouse', 'toWarehouse', 'product', 'creator']);

            } catch (ValidationException $e) {
                throw $e;
            } catch (Exception $e) {
                throw new Exception("Failed to send mutation: {$e->getMessage()}");
            }
        });
    }

    public function receive(
        int $mutationId,
        float $receivedQty,
        float $damagedQty = 0,
    ): StockMutation {
        return DB::transaction(function () use ($mutationId, $receivedQty, $damagedQty) {
            try {
                $mutation = $this->stockMutation->findOrFail($mutationId);

                if ($mutation->status !== 'dikirim') {
                    throw new Exception('Mutation sudah diterima atau tidak valid untuk diterima');
                }

                $totalReceived = $receivedQty + $damagedQty;

                if ($totalReceived > $mutation->quantity) {
                    throw ValidationException::withMessages([
                        'received_qty' => 'Jumlah diterima melebihi quantity mutation: '.$mutation->quantity,
                    ]);
                }

                $mutation->update([
                    'received_qty' => $receivedQty,
                    'damaged_qty' => $damagedQty,
                    'status' => 'completed', // Use English status for mutator
                    'received_at' => now(),
                    'received_by' => Auth::id(),
                ]);

                // Reduce stock from source warehouse
                $this->updateStockAction->execute(
                    warehouseId: $mutation->from_warehouse,
                    productId: $mutation->product_id,
                    quantity: -$mutation->quantity, // Negative for outgoing
                    type: 'mutation_sent',
                    referenceId: $mutation->id,
                    referenceCode: $mutation->code,
                    notes: "Mutation sent: {$mutation->code}"
                );

                // Add stock to destination warehouse (only received quantity, damaged doesn't add stock)
                if ($receivedQty > 0) {
                    $this->updateStockAction->execute(
                        warehouseId: $mutation->to_warehouse,
                        productId: $mutation->product_id,
                        quantity: $receivedQty, // Positive for incoming
                        type: 'mutation_received',
                        referenceId: $mutation->id,
                        referenceCode: $mutation->code,
                        notes: "Mutation received: {$mutation->code}"
                    );
                }

                return $mutation->load(['fromWarehouse', 'toWarehouse', 'product', 'creator', 'receiver']);

            } catch (ValidationException $e) {
                throw $e;
            } catch (Exception $e) {
                throw new Exception("Failed to receive mutation: {$e->getMessage()}");
            }
        });
    }

    private function generateMutationCode(): string
    {
        $date = now()->format('Ymd');
        $prefix = 'MT';

        $lastMutation = $this->stockMutation
            ->where('code', 'like', "{$prefix}-{$date}-%")
            ->orderBy('code', 'desc')
            ->first();

        if ($lastMutation) {
            $lastNumber = (int) substr($lastMutation->code, -3);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return sprintf('%s-%s-%03d', $prefix, $date, $newNumber);
    }
}
