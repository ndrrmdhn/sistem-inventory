<?php

namespace App\Http\Requests\Transaction;

use Illuminate\Foundation\Http\FormRequest;

class ReceiveMutationRequest extends FormRequest
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
            'received_qty' => 'required|numeric|min:0',
            'damaged_qty' => 'nullable|numeric|min:0',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'received_qty.required' => 'Jumlah diterima harus diisi.',
            'received_qty.min' => 'Jumlah diterima tidak boleh negatif.',
            'damaged_qty.min' => 'Jumlah rusak tidak boleh negatif.',
        ];
    }
}
