<?php

namespace App\Http\Requests\Suppliers;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateSupplierRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            // Bersihkan input dari potensi XSS
            'name' => strip_tags(trim($this->name)),
            'contact_person' => strip_tags(trim($this->contact_person)),
            'phone' => trim($this->phone),
            'email' => strtolower(trim($this->email)),
            'address' => strip_tags(trim($this->address)),
            'tax_id' => strtoupper(trim($this->tax_id)),
        ]);
    }

    public function rules(): array
    {
        $supplierId = $this->route('supplier')?->id ?? $this->route('supplier');

        return [
            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z0-9\s\-\.\(\)&]+$/',
            ],
            'contact_person' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                'regex:/^[a-zA-Z\s\-\.\']+$/',
            ],
            'phone' => [
                'sometimes',
                'required',
                'string',
                'max:20',
                'regex:/^[0-9\-\+\(\)\s]+$/',
            ],
            'email' => [
                'sometimes',
                'required',
                'email:rfc,dns',
                'max:255',
                Rule::unique('suppliers', 'email')->ignore($supplierId),
            ],
            'address' => [
                'sometimes',
                'required',
                'string',
                'max:1000',
            ],
            'tax_id' => [
                'sometimes',
                'required',
                'string',
                'max:50',
                Rule::unique('suppliers', 'tax_id')->ignore($supplierId),
                'regex:/^[A-Z0-9\-]+$/',
            ],
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kode supplier wajib diisi.',
            'code.string' => 'Kode supplier harus berupa teks.',
            'code.max' => 'Kode supplier tidak boleh lebih dari 20 karakter.',
            'code.unique' => 'Kode supplier sudah digunakan.',
            'code.regex' => 'Kode supplier hanya boleh mengandung huruf besar, angka, dan tanda hubung.',
            'name.required' => 'Nama supplier wajib diisi.',
            'name.string' => 'Nama supplier harus berupa teks.',
            'name.max' => 'Nama supplier tidak boleh lebih dari 255 karakter.',
            'name.regex' => 'Nama supplier hanya boleh mengandung huruf, angka, spasi, dan tanda hubung (-), titik, atau kurung.',
            'contact_person.required' => 'Nama kontak person wajib diisi.',
            'contact_person.string' => 'Nama kontak person harus berupa teks.',
            'contact_person.max' => 'Nama kontak person tidak boleh lebih dari 255 karakter.',
            'contact_person.regex' => 'Nama kontak person hanya boleh mengandung huruf, spasi, titik, dan apostrof.',
            'phone.required' => 'Nomor telepon wajib diisi.',
            'phone.string' => 'Nomor telepon harus berupa teks.',
            'phone.max' => 'Nomor telepon tidak boleh lebih dari 20 karakter.',
            'phone.regex' => 'Format nomor telepon tidak valid.',
            'email.required' => 'Email wajib diisi.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email tidak boleh lebih dari 255 karakter.',
            'email.unique' => 'Email sudah digunakan.',
            'address.required' => 'Alamat wajib diisi.',
            'address.string' => 'Alamat harus berupa teks.',
            'address.max' => 'Alamat tidak boleh lebih dari 1000 karakter.',
            'tax_id.required' => 'NPWP wajib diisi.',
            'tax_id.string' => 'NPWP harus berupa teks.',
            'tax_id.max' => 'NPWP tidak boleh lebih dari 50 karakter.',
            'tax_id.unique' => 'NPWP sudah digunakan.',
            'tax_id.regex' => 'Format NPWP tidak valid.',
            'is_active.boolean' => 'Status aktif harus berupa boolean.',
        ];
    }
}
