import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { StockHistoryToolbarProps } from '@/types/models/stock-history';

export function StockHistoryToolbar({
    searchValue,
    onSearchChange,
    onClearFilters,
    isSearching,
    hasActiveFilters,
    filters,
    warehouses,
    products,
    onWarehouseChange,
    onProductChange,
    onReferenceTypeChange,
}: StockHistoryToolbarProps) {
    return (
        <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Cari kode referensi..."
                            value={searchValue}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                </div>

                <div className="flex gap-2">
                    <div className="w-48">
                        <Select value={filters.warehouse_id || 'all'} onValueChange={onWarehouseChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Gudang" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Gudang</SelectItem>
                                {warehouses.map((warehouse) => (
                                    <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                        {warehouse.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="w-48">
                        <Select value={filters.product_id || 'all'} onValueChange={onProductChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Produk" />
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
                    </div>

                    <div className="w-48">
                        <Select value={filters.reference_type || 'all'} onValueChange={onReferenceTypeChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Semua Tipe" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Semua Tipe</SelectItem>
                                <SelectItem value="inbound">Inbound</SelectItem>
                                <SelectItem value="mutation_sent">Mutasi Keluar</SelectItem>
                                <SelectItem value="mutation_received">Mutasi Masuk</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onClearFilters}
                            className="px-3"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>

            <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>Penambahan stok</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Pengurangan stok</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span>Tidak ada perubahan</span>
                </div>
            </div>
        </div>
    );
}
