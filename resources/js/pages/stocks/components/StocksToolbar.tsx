import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StocksToolbarProps } from '@/types/models/stocks';

export function StocksToolbar({
    searchValue,
    onSearchChange,
    onClearFilters,
    isSearching,
    hasActiveFilters,
    filters,
    warehouses,
    products,
}: StocksToolbarProps) {
    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Stok</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Lihat stok produk per gudang
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari produk..."
                        value={searchValue}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-9 h-10"
                        disabled={isSearching}
                    />
                </div>
                <Select value={filters.warehouse_id || 'all'} onValueChange={(value) => {
                    // TODO: update filters
                }}>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder="Pilih Warehouse" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Warehouse</SelectItem>
                        {warehouses.map((warehouse) => (
                            <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                {warehouse.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={filters.product_id || 'all'} onValueChange={(value) => {
                    // TODO: update filters
                }}>
                    <SelectTrigger className="h-10">
                        <SelectValue placeholder="Pilih Produk" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Semua Produk</SelectItem>
                        {products.map((product) => (
                            <SelectItem key={product.id} value={product.id.toString()}>
                                {product.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <div></div> {/* Empty for alignment */}
            </div>

            {hasActiveFilters && (
                <div className="mb-6">
                    <Button
                        variant="outline"
                        onClick={onClearFilters}
                        disabled={isSearching}
                        className="gap-2"
                    >
                        <X className="h-4 w-4" />
                        Hapus Filter
                    </Button>
                </div>
            )}
        </>
    );
}