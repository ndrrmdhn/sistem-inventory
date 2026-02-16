<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'category_id',
        'name',
        'unit',
        'min_stock',
        'max_stock',
        'price',
        'cost',
        'description',
        'is_active',
    ];

    protected $appends = [];

    public function scopeSearch($query, ?string $search): void
    {
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }
    }

    protected function casts(): array
    {
        return [
            'min_stock' => 'integer',
            'max_stock' => 'integer',
            'price' => 'decimal:2',
            'cost' => 'decimal:2',
            'is_active' => 'boolean',
            'deleted_at' => 'datetime',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function scopeActive($query): void
    {
        $query->where('is_active', true);
    }
}
