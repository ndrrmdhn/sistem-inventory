<?php

namespace App\Actions\Customers;

use App\Models\Customer;

class UpdateCustomerAction
{
    /**
     * Update an existing customer.
     *
     * @param  array<string, mixed>  $input
     */
    public function execute(Customer $customer, array $input): Customer
    {
        // Validasi
        if (! $customer) {
            throw new \Exception('Pelanggan tidak ditemukan');
        }

        $customer->update([
            'name' => $input['name'],
            'contact_person' => $input['contact_person'],
            'phone' => $input['phone'],
            'email' => $input['email'],
            'address' => $input['address'],
            'is_active' => $input['is_active'] ?? true,
        ]);

        return $customer;
    }
}
