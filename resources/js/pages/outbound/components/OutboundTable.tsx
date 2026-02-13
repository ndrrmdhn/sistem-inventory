import { Eye, FolderOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import type { OutboundTableProps } from '@/types/models/outbound';

export function OutboundTable({
    outbounds,
    onShow,
}: OutboundTableProps) {
    if (outbounds.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <FolderOpen className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada Outbound</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Mulai dengan menambahkan transaksi outbound pertama
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border bg-card shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold">Kode</TableHead>
                        <TableHead className="font-semibold">Customer</TableHead>
                        <TableHead className="font-semibold">Produk</TableHead>
                        <TableHead className="font-semibold">Warehouse</TableHead>
                        <TableHead className="font-semibold">Qty</TableHead>
                        <TableHead className="font-semibold">Tanggal</TableHead>
                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {outbounds.map((outbound) => (
                        <TableRow key={outbound.id} className="group">
                            <TableCell>
                                <Badge variant="secondary" className="font-mono text-xs">
                                    {outbound.code}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{outbound.customer.name}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{outbound.product.name}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{outbound.warehouse.name}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{outbound.quantity}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{new Date(outbound.sale_date).toLocaleDateString('id-ID')}</div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onShow(outbound)}
                                        className="h-8 gap-1.5"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only">Lihat</span>
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