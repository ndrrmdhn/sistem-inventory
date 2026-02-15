<?php

namespace App\Http\Requests\WarehouseUsers;

use Illuminate\Foundation\Http\FormRequest;

class SwapWarehouseUsersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'warehouse_user1_id' => 'required|integer|exists:warehouse_users,id',
            'warehouse_user2_id' => 'required|integer|exists:warehouse_users,id|different:warehouse_user1_id',
        ];
    }

    public function messages(): array
    {
        return [
            'warehouse_user1_id.required' => 'ID warehouse user pertama wajib diisi.',
            'warehouse_user1_id.integer' => 'ID warehouse user pertama harus angka.',
            'warehouse_user1_id.exists' => 'Warehouse user pertama tidak ditemukan.',
            'warehouse_user2_id.required' => 'ID warehouse user kedua wajib diisi.',
            'warehouse_user2_id.integer' => 'ID warehouse user kedua harus angka.',
            'warehouse_user2_id.exists' => 'Warehouse user kedua tidak ditemukan.',
            'warehouse_user2_id.different' => 'ID warehouse user harus berbeda.',
        ];
    }
}
