<?php

namespace App\Actions\Suppliers;

use App\Models\Supplier;
use Illuminate\Support\Facades\DB;

class CreateSupplierAction
{
    /**
     * Create a new supplier.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(array $input): Supplier
    {
        return DB::transaction(function () use ($input) {
            $code = $input['code'] ?? $this->generateSupplierCode();

            $supplier = Supplier::create([
                'code' => $code,
                'name' => $input['name'],
                'contact_person' => $input['contact_person'],
                'phone' => $input['phone'],
                'email' => $input['email'],
                'address' => $input['address'],
                'tax_id' => $input['tax_id'],
                'is_active' => $input['is_active'] ?? true,
            ]);

            return $supplier;
        });
    }

    /**
     * Generate unique supplier code.
     */
    private function generateSupplierCode(): string
    {
        do {
            $code = 'SUP-'.str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT);
        } while (Supplier::where('code', $code)->exists());

        return $code;
    }
}
