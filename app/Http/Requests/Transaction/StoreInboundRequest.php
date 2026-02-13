<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class StoreInboundRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'warehouse_id' => 'required|exists:warehouses,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.01',
            'unit_price' => 'nullable|numeric|min:0',
            'received_date' => 'required|date|before_or_equal:today',
            'notes' => 'nullable|string|max:500',
            'attachment' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'warehouse_id.required' => 'Gudang harus dipilih.',
            'supplier_id.required' => 'Supplier harus dipilih.',
            'product_id.required' => 'Produk harus dipilih.',
            'quantity.required' => 'Jumlah harus diisi.',
            'quantity.min' => 'Jumlah harus lebih dari 0.',
            'received_date.required' => 'Tanggal penerimaan harus diisi.',
            'received_date.before_or_equal' => 'Tanggal penerimaan tidak boleh di masa depan.',
            'attachment.mimes' => 'File harus berupa PDF atau gambar.',
            'attachment.max' => 'Ukuran file maksimal 2MB.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Set warehouse_id based on user role
        if (! auth()->user()->hasRole('super-admin') && ! $this->has('warehouse_id')) {
            $userWarehouse = auth()->user()->warehouses()->first();
            if ($userWarehouse) {
                $this->merge(['warehouse_id' => $userWarehouse->id]);
            }
        }
    }
}
