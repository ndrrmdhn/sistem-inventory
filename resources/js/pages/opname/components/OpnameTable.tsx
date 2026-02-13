import { Eye, CheckCircle } from 'lucide-react';
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
import type { OpnameTableProps } from '@/types/models/opname';

export function OpnameTable({
    opnames,
    onShow,
    onApprove,
}: OpnameTableProps) {
    if (opnames.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <Eye className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada Opname</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        Mulai dengan menambahkan opname pertama
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
                        <TableHead className="font-semibold">Produk</TableHead>
                        <TableHead className="font-semibold">Warehouse</TableHead>
                        <TableHead className="font-semibold">System Qty</TableHead>
                        <TableHead className="font-semibold">Physical Qty</TableHead>
                        <TableHead className="font-semibold">Selisih</TableHead>
                        <TableHead className="font-semibold">Status</TableHead>
                        <TableHead className="text-right font-semibold">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {opnames.map((opname) => (
                        <TableRow key={opname.id} className="group">
                            <TableCell>
                                <Badge variant="secondary" className="font-mono text-xs">
                                    {opname.code}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{opname.product.name}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{opname.warehouse.name}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{opname.system_qty}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{opname.physical_qty}</div>
                            </TableCell>
                            <TableCell>
                                <div className={`font-medium ${opname.difference_type === 'lebih' ? 'text-green-600' : opname.difference_type === 'kurang' ? 'text-red-600' : 'text-gray-600'}`}>
                                    {opname.difference_type === 'lebih' ? '+' : opname.difference_type === 'kurang' ? '-' : ''}{opname.difference_qty}
                                </div>
                            </TableCell>
                            <TableCell>
                                <Badge variant={opname.status === 'approved' ? 'default' : 'secondary'}>
                                    {opname.status === 'approved' ? 'Approved' : 'Draft'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onShow(opname)}
                                        className="h-8 gap-1.5"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        <span className="sr-only sm:not-sr-only">Lihat</span>
                                    </Button>
                                    {onApprove && opname.status === 'draft' && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onApprove(opname)}
                                            className="h-8 gap-1.5 text-green-600 hover:text-green-700"
                                        >
                                            <CheckCircle className="h-3.5 w-3.5" />
                                            <span className="sr-only sm:not-sr-only">Approve</span>
                                        </Button>
                                    )}
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
