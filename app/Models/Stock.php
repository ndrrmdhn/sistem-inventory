<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Stock extends Model
{
    /** @use HasFactory<\Database\Factories\StockFactory> */
    use HasFactory;

    protected $fillable = [
        'warehouse_id',
        'product_id',
        'quantity',
        'reserved_qty',
        'last_updated',
        'updated_by',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'reserved_qty' => 'decimal:2',
        'available_qty' => 'decimal:2',
    ];

    protected $appends = ['available_qty'];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function histories()
    {
        return $this->hasMany(StockHistory::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getAvailableQtyAttribute(): float
    {
        return $this->quantity - $this->reserved_qty;
    }

    public function scopeByWarehouse($query, $warehouseId)
    {
        return $query->where('warehouse_id', $warehouseId);
    }

    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    public function scopeAvailable($query)
    {
        return $query->whereRaw('quantity > reserved_qty');
    }
}
