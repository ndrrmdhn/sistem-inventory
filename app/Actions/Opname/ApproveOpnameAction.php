<?php

declare(strict_types=1);

namespace App\Actions\Opname;

use App\Actions\Stock\UpdateStockAction;
use App\Models\Opname;
use Exception;
use Illuminate\Support\Facades\DB;

class ApproveOpnameAction
{
    public function __construct(
        private readonly UpdateStockAction $updateStockAction,
    ) {}

    public function execute(int $opnameId): Opname
    {
        return DB::transaction(function () use ($opnameId) {
            $opname = Opname::findOrFail($opnameId);

            // Check if already has stock adjustment (simple check)
            $existingAdjustment = $opname->stockHistories()
                ->where('reference_type', 'adjustment')
                ->exists();

            if ($existingAdjustment) {
                throw new Exception('Opname sudah diapprove sebelumnya.');
            }

            // Update stock if there's difference
            if ($opname->difference_type !== 'sama') {
                $adjustmentQty = $opname->difference_type === 'lebih'
                    ? $opname->difference_qty
                    : -$opname->difference_qty;

                $this->updateStockAction->execute(
                    warehouseId: $opname->warehouse_id,
                    productId: $opname->product_id,
                    quantity: $adjustmentQty,
                    type: 'adjustment',
                    referenceId: $opname->id,
                    referenceCode: $opname->code,
                    notes: "Stock adjustment from opname: {$opname->code}"
                );
            }

            // Update status to approved
            $opname->update(['status' => 'approved']);

            return $opname->load(['warehouse', 'product', 'creator', 'stockHistories']);
        });
    }
}
