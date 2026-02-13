<?php

namespace App\Policies;

use App\Models\Opname;
use App\Models\User;

class OpnamePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Opname $opname): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            return $user->warehouses()->where('warehouses.id', $opname->warehouse_id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyRole(['super-admin', 'admin']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Opname $opname): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            return $user->warehouses()->where('warehouses.id', $opname->warehouse_id)->exists();
        }

        return false;
    }

    /**
     * Determine whether the user can approve the opname.
     */
    public function approve(User $user, Opname $opname): bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        if ($user->hasRole('admin')) {
            return $user->warehouses()->where('warehouses.id', $opname->warehouse_id)->exists();
        }

        return false;
    }
}
