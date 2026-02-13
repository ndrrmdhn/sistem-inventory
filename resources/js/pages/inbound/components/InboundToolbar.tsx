import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { InboundToolbarProps } from '@/types/models/inbound';

export function InboundToolbar({
    searchValue,
    onSearchChange,
    onAddClick,
    onClearFilters,
    isSearching,
    hasActiveFilters,
    filters,
    warehouses,
}: InboundToolbarProps) {
    return (
        <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inbound</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Kelola transaksi inbound
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={onAddClick} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Tambah Inbound
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Cari kode, supplier, produk..."
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
                <Input
                    type="date"
                    placeholder="Tanggal Mulai"
                    value={filters.start_date || ''}
                    onChange={(e) => {
                        // TODO: update filters
                    }}
                    className="h-10"
                />
                <Input
                    type="date"
                    placeholder="Tanggal Akhir"
                    value={filters.end_date || ''}
                    onChange={(e) => {
                        // TODO: update filters
                    }}
                    className="h-10"
                />
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