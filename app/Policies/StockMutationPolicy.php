<?php

namespace App\Policies;

use App\Models\StockMutation;
use App\Models\User;

class StockMutationPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(['super-admin', 'admin', 'viewer']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, StockMutation $stockMutation): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($user->hasRole(['admin', 'viewer'])) {
            $userWarehouseIds = $user->warehouses()->pluck('warehouses.id')->toArray();

            return in_array($stockMutation->from_warehouse_id, $userWarehouseIds) ||
                   in_array($stockMutation->to_warehouse_id, $userWarehouseIds);
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, StockMutation $stockMutation): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            $userWarehouseIds = $user->warehouses()->pluck('warehouses.id')->toArray();

            return in_array($stockMutation->from_warehouse_id, $userWarehouseIds) ||
                   in_array($stockMutation->to_warehouse_id, $userWarehouseIds);
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, StockMutation $stockMutation): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, StockMutation $stockMutation): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, StockMutation $stockMutation): bool
    {
        return $user->hasRole('super-admin');
    }

    /**
     * Determine whether the user can receive a mutation.
     */
    public function receive(User $user, StockMutation $stockMutation): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            return $user->warehouses()->where('warehouses.id', $stockMutation->to_warehouse_id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can reject a mutation.
     */
    public function reject(User $user, StockMutation $stockMutation): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            return $user->warehouses()->where('warehouses.id', $stockMutation->to_warehouse_id)->exists();
        }

        return false;
    }
}
