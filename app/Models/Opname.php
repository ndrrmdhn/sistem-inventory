<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Opname extends Model
{
    /** @use HasFactory<\Database\Factories\OpnameFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'warehouse_id',
        'product_id',
        'system_qty',
        'physical_qty',
        'difference_qty',
        'difference_type',
        'status',
        'notes',
        'opname_date',
        'created_by',
    ];

    protected $casts = [
        'system_qty' => 'decimal:2',
        'physical_qty' => 'decimal:2',
        'difference_qty' => 'decimal:2',
        'opname_date' => 'datetime',
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function stockHistories(): HasMany
    {
        return $this->hasMany(StockHistory::class, 'reference_id')
            ->where('reference_type', 'opname');
    }

    public function scopeByWarehouse($query, $warehouseId)
    {
        return $query->where('warehouse_id', $warehouseId);
    }

    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('opname_date', [$startDate, $endDate]);
    }

    public function scopeWithDifferences($query)
    {
        return $query->where('difference_type', '!=', 'sama');
    }

    public function scopeShortages($query)
    {
        return $query->where('difference_type', 'kurang');
    }

    public function scopeSurpluses($query)
    {
        return $query->where('difference_type', 'lebih');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }
}
