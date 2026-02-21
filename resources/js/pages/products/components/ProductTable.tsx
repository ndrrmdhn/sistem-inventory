import { Package, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatRupiah } from '@/utils/format';

interface Product {
    id: number;
    code: string;
    name: string;
    category?: { name: string };
    unit: string;
    price: number;
    is_active: boolean;
}

interface ProductTableProps {
    products: Product[];
    selectedIds: number[];
    onSelectAll: (value: boolean) => void;
    onSelectOne: (id: number, value: boolean) => void;
    onEdit: (product: Product) => void;
    onDelete: (product: Product) => void;
    allSelected: boolean;
    someSelected: boolean;
}

export function ProductTable({
    products,
    selectedIds,
    onSelectAll,
    onSelectOne,
    onEdit,
    onDelete,
    allSelected,
    someSelected,
}: ProductTableProps) {

    if (products.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada Produk</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Mulai dengan menambahkan produk pertama ke inventaris Anda
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12">
                            <Checkbox
                                checked={allSelected}
                                onCheckedChange={(value: boolean) => onSelectAll(Boolean(value))}
                                aria-label="Pilih semua"
                                className={someSelected ? 'data-[state=checked]:bg-muted-foreground' : ''}
                            />
                        </TableHead>

                        <TableHead>Kode</TableHead>
                        <TableHead>Nama Produk</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead>Satuan</TableHead>
                        <TableHead>Harga</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {products.map((product) => (
                        <TableRow
                            key={product.id}
                            className={!product.is_active ? 'opacity-60' : ''}
                        >
                            {/* Checkbox */}
                            <TableCell>
                                <Checkbox
                                    checked={selectedIds.includes(product.id)}
                                    onCheckedChange={(value: boolean) =>
                                        onSelectOne(product.id, Boolean(value))
                                    }
                                    aria-label={`Pilih ${product.name}`}
                                />
                            </TableCell>

                            {/* Code */}
                            <TableCell className="max-w-30">
                                <Badge
                                    variant="secondary"
                                    className="font-mono text-xs truncate block"
                                >
                                    {product.code}
                                </Badge>
                            </TableCell>

                            {/* Name */}
                            <TableCell className="font-medium max-w-50 truncate">
                                {product.name}
                            </TableCell>

                            {/* Category */}
                            <TableCell className="max-w-40 truncate">
                                <Badge variant="outline" className="truncate block">
                                    {product.category?.name ?? '-'}
                                </Badge>
                            </TableCell>

                            {/* Unit */}
                            <TableCell>
                                <div className="flex items-center gap-2 text-sm">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <span>{product.unit}</span>
                                </div>
                            </TableCell>

                            {/* Price */}
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                                {formatRupiah(product.price)}
                            </TableCell>

                            {/* Status */}
                            <TableCell>
                                <Badge
                                    variant={product.is_active ? 'default' : 'destructive'}
                                >
                                    {product.is_active ? 'Aktif' : 'Tidak Aktif'}
                                </Badge>
                            </TableCell>

                            {/* Actions */}
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(product)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>

                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive hover:bg-destructive/10"
                                        onClick={() => onDelete(product)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
