<?php

declare(strict_types=1);

namespace App\Actions\Transaction;

use App\Actions\Stock\CheckStockAvailabilityAction;
use App\Actions\Stock\UpdateStockAction;
use App\Models\OutboundTransaction;
use App\Services\FileUploadService;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateOutboundTransactionAction
{
    public function __construct(
        private readonly UpdateStockAction $updateStockAction,
        private readonly CheckStockAvailabilityAction $checkStockAvailabilityAction,
        private readonly FileUploadService $fileUploadService,
        private readonly OutboundTransaction $outboundTransaction,
    ) {}

    public function execute(
        int $customerId,
        int $warehouseId,
        int $productId,
        float $quantity,
        float $unitPrice,
        string $saleDate,
        ?string $notes = null,
        ?UploadedFile $attachment = null,
    ): OutboundTransaction {
        return DB::transaction(function () use ($customerId, $warehouseId, $productId, $quantity, $unitPrice, $saleDate, $notes, $attachment) {
            try {
                $attachmentPath = null;
                if ($attachment) {
                    $attachmentPath = $this->fileUploadService->upload(
                        file: $attachment,
                        folder: 'attachments/outbound',
                        disk: 'public',
                        allowedMimes: [
                            'application/pdf',
                            'application/msword',
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                            'application/vnd.ms-excel',
                            'image/jpeg',
                            'image/png',
                        ],
                        maxSize: 5120, // 5MB
                        prefix: 'outbound'
                    );
                }

                if ($quantity <= 0) {
                    throw new Exception('Jumlah harus lebih besar dari 0');
                }

                if ($unitPrice <= 0) {
                    throw new Exception('Harga satuan harus lebih besar dari 0');
                }

                if (! \App\Models\Customer::find($customerId)) {
                    throw new Exception('Pelanggan tidak ditemukan');
                }

                if (! \App\Models\Warehouse::find($warehouseId)) {
                    throw new Exception('Gudang tidak ditemukan');
                }

                if (! \App\Models\Product::find($productId)) {
                    throw new Exception('Produk tidak ditemukan');
                }

                if (! strtotime($saleDate)) {
                    throw new Exception('Tanggal penjualan tidak valid');
                }

                // Check stock availability first
                $stockInfo = $this->checkStockAvailabilityAction->getStockInfo($warehouseId, $productId);

                if (! $stockInfo['is_available'] || $stockInfo['available'] < $quantity) {
                    throw ValidationException::withMessages([
                        'quantity' => "Stok tidak cukup. Tersedia: {$stockInfo['available']}, diminta: {$quantity}",
                    ]);
                }

                $code = $this->generateTransactionCode();

                $totalPrice = $unitPrice * $quantity;

                $transaction = $this->outboundTransaction->create([
                    'code' => $code,
                    'customer_id' => $customerId,
                    'warehouse_id' => $warehouseId,
                    'product_id' => $productId,
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'sale_date' => $saleDate,
                    'notes' => $notes,
                    'attachment' => $attachmentPath,
                    'created_by' => Auth::id(),
                ]);

                // Update stock with negative quantity
                $this->updateStockAction->execute(
                    warehouseId: $warehouseId,
                    productId: $productId,
                    quantity: -$quantity, // Negative for outbound
                    type: 'outbound',
                    referenceId: $transaction->id,
                    referenceCode: $code,
                    notes: "Outbound transaction: {$code}"
                );

                return $transaction->load(['customer', 'warehouse', 'product', 'creator']);

            } catch (ValidationException $e) {
                throw $e; // Re-throw validation exceptions
            } catch (Exception $e) {
                throw new Exception("Failed to create outbound transaction: {$e->getMessage()}");
            }
        });
    }

    private function generateTransactionCode(): string
    {
        $date = now()->format('Ymd');
        $prefix = 'BK';

        $lastTransaction = $this->outboundTransaction
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
