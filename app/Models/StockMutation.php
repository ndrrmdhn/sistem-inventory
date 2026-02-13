<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StockMutation extends Model
{
    /** @use HasFactory<\Database\Factories\StockMutationFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'from_warehouse',
        'to_warehouse',
        'product_id',
        'quantity',
        'received_qty',
        'damaged_qty',
        'status',
        'sent_at',
        'received_at',
        'created_by',
        'received_by',
        'notes',
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'received_qty' => 'decimal:2',
        'damaged_qty' => 'decimal:2',
        'sent_at' => 'datetime',
        'received_at' => 'datetime',
    ];

    protected $appends = ['status_display'];

    // Status mapping from database to frontend
    public const STATUS_MAPPING = [
        'dikirim' => 'sent',
        'diterima' => 'received',
        'ditolak' => 'rejected',
        'selesai' => 'completed',
    ];

    // Reverse mapping for saving to database
    public const STATUS_REVERSE_MAPPING = [
        'sent' => 'dikirim',
        'received' => 'diterima',
        'rejected' => 'ditolak',
        'completed' => 'selesai',
    ];

    public function getStatusDisplayAttribute(): string
    {
        return self::STATUS_MAPPING[$this->status] ?? $this->status;
    }

    public function setStatusAttribute($value)
    {
        // If frontend sends English status, convert to Indonesian for database
        if (array_key_exists($value, self::STATUS_REVERSE_MAPPING)) {
            $this->attributes['status'] = self::STATUS_REVERSE_MAPPING[$value];
        } else {
            $this->attributes['status'] = $value;
        }
    }

    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse');
    }

    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    public function stockHistories(): HasMany
    {
        return $this->hasMany(StockHistory::class, 'reference_id')
            ->whereIn('reference_type', ['mutation_sent', 'mutation_received']);
    }

    public function scopeByFromWarehouse($query, $warehouseId)
    {
        return $query->where('from_warehouse', $warehouseId);
    }

    public function scopeByToWarehouse($query, $warehouseId)
    {
        return $query->where('to_warehouse', $warehouseId);
    }

    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopePending($query)
    {
        return $query->whereIn('status', ['dikirim', 'diterima']);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'selesai');
    }
}
