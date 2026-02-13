<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class StoreMutationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && (auth()->user()->hasRole(['super-admin', 'admin']));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'from_warehouse' => 'required|exists:warehouses,id',
            'to_warehouse' => [
                'required',
                'exists:warehouses,id',
                'different:from_warehouse',
            ],
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string|max:500',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'from_warehouse.required' => 'Gudang asal harus dipilih.',
            'to_warehouse.required' => 'Gudang tujuan harus dipilih.',
            'to_warehouse.different' => 'Gudang tujuan harus berbeda dari gudang asal.',
            'product_id.required' => 'Produk harus dipilih.',
            'quantity.required' => 'Jumlah harus diisi.',
            'quantity.min' => 'Jumlah harus lebih dari 0.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $user = auth()->user();

        // Set from_warehouse based on user role
        if (! $user->hasRole('super-admin') && ! $this->has('from_warehouse')) {
            $userWarehouse = $user->warehouses()->first();
            if ($userWarehouse) {
                $this->merge(['from_warehouse' => $userWarehouse->id]);
            }
        }
    }
}
