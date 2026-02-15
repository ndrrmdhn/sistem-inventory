<?php

namespace App\Http\Requests\Customers;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCustomerRequest extends FormRequest
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
        ]);
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-zA-Z0-9\s\-\.\(\)&]+$/',
            ],
            'contact_person' => [
                'nullable',
                'string',
                'max:100',
                'regex:/^[a-zA-Z\s\-\.\']+$/',
            ],
            'phone' => [
                'nullable',
                'string',
                'max:20',
                'regex:/^[0-9\-\+\(\)\s]+$/',
            ],
            'email' => [
                'nullable',
                'email:rfc,dns',
                'max:100',
                Rule::unique('customers', 'email'),
            ],
            'address' => [
                'nullable',
                'string',
                'max:1000',
            ],
            'is_active' => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'code.required' => 'Kode customer wajib diisi.',
            'code.string' => 'Kode customer harus berupa teks.',
            'code.max' => 'Kode customer tidak boleh lebih dari 20 karakter.',
            'code.unique' => 'Kode customer sudah digunakan.',
            'code.regex' => 'Kode customer hanya boleh mengandung huruf besar, angka, dan tanda hubung.',
            'name.required' => 'Nama customer wajib diisi.',
            'name.string' => 'Nama customer harus berupa teks.',
            'name.max' => 'Nama customer tidak boleh lebih dari 100 karakter.',
            'name.regex' => 'Nama customer hanya boleh mengandung huruf, angka, spasi, dan tanda hubung (-), titik, atau kurung.',
            'contact_person.string' => 'Nama kontak person harus berupa teks.',
            'contact_person.max' => 'Nama kontak person tidak boleh lebih dari 100 karakter.',
            'contact_person.regex' => 'Nama kontak person hanya boleh mengandung huruf, spasi, titik, dan apostrof.',
            'phone.string' => 'Nomor telepon harus berupa teks.',
            'phone.max' => 'Nomor telepon tidak boleh lebih dari 20 karakter.',
            'phone.regex' => 'Format nomor telepon tidak valid.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email tidak boleh lebih dari 100 karakter.',
            'email.unique' => 'Email sudah digunakan.',
            'address.string' => 'Alamat harus berupa teks.',
            'address.max' => 'Alamat tidak boleh lebih dari 1000 karakter.',
            'is_active.boolean' => 'Status aktif harus berupa boolean.',
        ];
    }
}
