import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { StockHistoryTableProps } from '@/types/models/stock-history';

export function StockHistoryTable({
    stockHistories,
    isLoading,
}: StockHistoryTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="text-sm text-muted-foreground">Memuat data...</div>
            </div>
        );
    }

    if (stockHistories.length === 0) {
        return (
            <div className="rounded-lg border border-dashed bg-card">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <div className="h-10 w-10 rounded-full bg-muted-foreground/20" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">Belum Ada History</h3>
                    <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                        History perubahan stok akan muncul di sini
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
                        <TableHead className="font-semibold">Waktu</TableHead>
                        <TableHead className="font-semibold">Produk</TableHead>
                        <TableHead className="font-semibold">Gudang</TableHead>
                        <TableHead className="font-semibold">Perubahan</TableHead>
                        <TableHead className="font-semibold">Dari → Ke</TableHead>
                        <TableHead className="font-semibold">Referensi</TableHead>
                        <TableHead className="font-semibold">Petugas</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {stockHistories.map((history) => (
                        <TableRow key={history.id} className="group">
                            <TableCell className="text-sm">
                                {format(new Date(history.created_at), 'dd/MM HH:mm', { locale: id })}
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{history.product?.name || '-'}</div>
                            </TableCell>
                            <TableCell>
                                <div className="font-medium">{history.warehouse?.name || '-'}</div>
                            </TableCell>
                            <TableCell>
                                <div className={`font-medium ${
                                    history.change_qty > 0 ? 'text-green-600' :
                                    history.change_qty < 0 ? 'text-red-600' : 'text-gray-600'
                                }`}>
                                    {history.change_qty > 0 ? '+' : ''}{history.change_qty}
                                </div>
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                                {history.previous_qty} → {history.new_qty}
                            </TableCell>
                            <TableCell>
                                <Badge variant="outline" className="font-mono text-xs">
                                    {history.reference_code || `${history.reference_type}#${history.reference_id}`}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-sm">
                                {history.creator?.name || '-'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
