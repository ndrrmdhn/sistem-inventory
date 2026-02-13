<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('outbound_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('code', 50)->unique();
            $table->foreignId('warehouse_id')->constrained('warehouses');
            $table->foreignId('customer_id')->constrained('customers');
            $table->foreignId('product_id')->constrained('products');
            $table->decimal('quantity', 10, 2);
            $table->decimal('unit_price', 12, 2);
            $table->decimal('total_price', 12, 2)->storedAs('quantity * unit_price');
            $table->date('sale_date');
            $table->foreignId('created_by')->constrained('users');
            $table->text('notes')->nullable();
            $table->string('attachment')->nullable();
            $table->timestamps();

            // Indexes
            $table->index(['code', 'warehouse_id', 'customer_id', 'product_id', 'sale_date', 'created_by']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('outbound_transactions');
    }
};
