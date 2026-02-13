<?php

declare(strict_types=1);

namespace App\Actions\Transaction;

use App\Actions\Stock\UpdateStockAction;
use App\Models\InboundTransaction;
use Exception;
use Illuminate\Support\Facades\DB;

class CreateInboundTransactionAction
{
    public function __construct(
        private readonly UpdateStockAction $updateStockAction,
        private readonly InboundTransaction $inboundTransaction,
    ) {}

    public function execute(
        int $supplierId,
        int $warehouseId,
        int $productId,
        float $quantity,
        float $unitPrice,
        string $receivedDate,
        ?string $notes = null,
    ): InboundTransaction {
        return DB::transaction(function () use ($supplierId, $warehouseId, $productId, $quantity, $unitPrice, $receivedDate, $notes) {
            try {
                $code = $this->generateTransactionCode();

                $transaction = $this->inboundTransaction->create([
                    'code' => $code,
                    'supplier_id' => $supplierId,
                    'warehouse_id' => $warehouseId,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'received_date' => $receivedDate,
                    'notes' => $notes,
                    'created_by' => auth()->id() ?? 1,
                ]);

                $transaction->refresh();

                // Update stock with positive quantity
                $this->updateStockAction->execute(
                    warehouseId: $warehouseId,
                    productId: $productId,
                    quantity: $quantity,
                    type: 'inbound',
                    referenceId: $transaction->id,
                    referenceCode: $code,
                    notes: "Inbound transaction: {$code}"
                );

                return $transaction->load(['supplier', 'warehouse', 'product', 'creator']);

            } catch (Exception $e) {
                throw new Exception("Failed to create inbound transaction: {$e->getMessage()}");
            }
        });
    }

    private function generateTransactionCode(): string
    {
        $date = now()->format('Ymd');
        $prefix = 'BM';

        $lastTransaction = $this->inboundTransaction
            ->where('code', 'like', "{$prefix}-{$date}-%")
            ->orderBy('code', 'desc')
            ->first();

        if ($lastTransaction) {
            $lastNumber = (int) substr($lastTransaction->code, -3);
            $newNumber = $lastNumber + 1;
        } else {
            $newNumber = 1;
        }

        return sprintf('%s-%s-%03d', $prefix, $date, $newNumber);
    }
}
