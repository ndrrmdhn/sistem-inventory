<?php

namespace App\Actions\Suppliers;

use App\Models\Supplier;

class UpdateSupplierAction
{
    /**
     * Update an existing supplier.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(Supplier $supplier, array $input): Supplier
    {
        $supplier->update([
            'name' => $input['name'],
            'contact_person' => $input['contact_person'],
            'phone' => $input['phone'],
            'email' => $input['email'],
            'address' => $input['address'],
            'tax_id' => $input['tax_id'],
            'is_active' => $input['is_active'] ?? true,
        ]);

        return $supplier;
    }
}
