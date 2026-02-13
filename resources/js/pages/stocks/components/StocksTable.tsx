import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { StocksTableProps } from '@/types/models/stocks';

export function StocksTable({
    stocks,
    isLoading,
    onShowStock,
}: StocksTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="text-sm text-muted-foreground">Memuat data...</div>
            </div>
        );
    }

    if (stocks.length === 0) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="text-sm text-muted-foreground">Tidak ada data stok</div>
            </div>
        );
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Produk</TableHead>
                        <TableHead>Gudang</TableHead>
                        <TableHead className="text-right">Qty Tersedia</TableHead>
                        <TableHead className="text-right">Qty Dipesan</TableHead>
                        <TableHead className="text-right">Qty Total</TableHead>
                        <TableHead className="text-right">Qty Minimum</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[100px]">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stocks.map((stock) => (
                        <TableRow key={stock.id}>
                            <TableCell className="font-medium">
                                {stock.product?.name || '-'}
                            </TableCell>
                            <TableCell>
                                {stock.warehouse?.name || '-'}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                                {stock.available_qty?.toLocaleString() || 0}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                                {stock.reserved_qty?.toLocaleString() || 0}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                                {stock.quantity?.toLocaleString() || 0}
                            </TableCell>
                            <TableCell className="text-right font-mono">
                                {stock.min_stock?.toLocaleString() || 0}
                            </TableCell>
                            <TableCell>
                                <Badge
                                    variant={
                                        (stock.available_qty || 0) <= (stock.min_stock || 0)
                                            ? 'destructive'
                                            : (stock.available_qty || 0) <= ((stock.min_stock || 0) * 1.5)
                                            ? 'secondary'
                                            : 'default'
                                    }
                                >
                                    {(stock.available_qty || 0) <= (stock.min_stock || 0)
                                        ? 'Kritis'
                                        : (stock.available_qty || 0) <= ((stock.min_stock || 0) * 1.5)
                                        ? 'Rendah'
                                        : 'Normal'
                                    }
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onShowStock(stock)}
                                    className="h-8 w-8 p-0"
                                >
                                    <Eye className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}