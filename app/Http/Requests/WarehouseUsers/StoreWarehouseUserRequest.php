<?php

namespace App\Http\Requests\WarehouseUsers;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreWarehouseUserRequest extends FormRequest
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
            'user_id' => [
                'required',
                'integer',
                'exists:users,id',
                'min:1',
                'max:2147483647',
                Rule::unique('warehouse_users')
                    ->where('warehouse_id', $this->warehouse_id)
                    ->whereNull('deleted_at'),
                function ($attribute, $value, $fail) {
                    $existing = \App\Models\WarehouseUser::where('user_id', $value)
                        ->where('warehouse_id', '!=', $this->warehouse_id)
                        ->whereNull('deleted_at')
                        ->exists();
                    if ($existing) {
                        $fail('Pengguna sudah ditugaskan ke gudang lain. Satu pengguna hanya bisa ditugaskan ke satu gudang.');
                    }
                },
            ],
            'warehouse_id' => [
                'required',
                'integer',
                'exists:warehouses,id',
                'min:1',
                'max:2147483647',
            ],
            'assigned_by' => [
                'nullable',
                'integer',
                'exists:users,id',
            ],
            'assigned_at' => [
                'nullable',
                'date',
            ],
            'is_primary' => [
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'user_id.required' => 'Pengguna wajib dipilih.',
            'user_id.integer' => 'Pengguna harus berupa angka.',
            'user_id.exists' => 'Pengguna yang dipilih tidak ditemukan.',
            'user_id.unique' => 'Pengguna ini sudah ditugaskan ke gudang ini.',
            'warehouse_id.required' => 'Gudang wajib dipilih.',
            'warehouse_id.integer' => 'Gudang harus berupa angka.',
            'warehouse_id.exists' => 'Gudang yang dipilih tidak ditemukan.',
            'assigned_by.integer' => 'Penugasan oleh harus berupa angka.',
            'assigned_by.exists' => 'Penugasan oleh tidak ditemukan.',
            'assigned_at.date' => 'Tanggal penugasan harus berupa tanggal yang valid.',
            'is_primary.boolean' => 'Status utama harus berupa boolean.',
        ];
    }
}
