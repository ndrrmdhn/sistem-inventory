<?php

namespace App\Policies;

use App\Models\StockHistory;
use App\Models\User;

class StockHistoryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin', 'viewer']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, StockHistory $stockHistory): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($user->hasRole(['admin', 'viewer'])) {
            return $user->warehouses()->where('warehouses.id', $stockHistory->warehouse_id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, StockHistory $stockHistory): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, StockHistory $stockHistory): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, StockHistory $stockHistory): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, StockHistory $stockHistory): bool
    {
        return false;
    }
}
