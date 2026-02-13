import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { StocksShowModalProps } from '@/types/models/stocks';

export function StocksShowModal({
    stock,
    isOpen,
    onClose,
}: StocksShowModalProps) {
    if (!stock) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Detail Stok</DialogTitle>
                </DialogHeader>

                <div className="max-h-[80vh] overflow-y-auto pr-4">
                    <div className="space-y-6">
                        {/* Stock Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Produk</label>
                                <p className="text-sm font-medium">{stock.product?.name || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Gudang</label>
                                <p className="text-sm font-medium">{stock.warehouse?.name || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Qty Total</label>
                                <p className="text-sm font-medium font-mono">{stock.quantity?.toLocaleString() || 0}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Qty Tersedia</label>
                                <p className="text-sm font-medium font-mono">{stock.available_qty?.toLocaleString() || 0}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Qty Dipesan</label>
                                <p className="text-sm font-medium font-mono">{stock.reserved_qty?.toLocaleString() || 0}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Qty Minimum</label>
                                <p className="text-sm font-medium font-mono">{stock.min_stock?.toLocaleString() || 0}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
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
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Terakhir Update</label>
                                <p className="text-sm font-medium">
                                    {stock.updated_at
                                        ? format(new Date(stock.updated_at), 'dd MMMM yyyy HH:mm', { locale: id })
                                        : '-'
                                    }
                                </p>
                            </div>
                        </div>

                        <Separator />

                        {/* Stock History */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Riwayat Perubahan Stok</h3>

                            {stock.histories && stock.histories.length > 0 ? (
                                <div className="border rounded-lg">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Tanggal</TableHead>
                                                <TableHead>Tipe</TableHead>
                                                <TableHead className="text-right">Qty Sebelum</TableHead>
                                                <TableHead className="text-right">Qty Sesudah</TableHead>
                                                <TableHead className="text-right">Perubahan</TableHead>
                                                <TableHead>Referensi</TableHead>
                                                <TableHead>User</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stock.histories.map((history) => (
                                                <TableRow key={history.id}>
                                                    <TableCell>
                                                        {format(new Date(history.created_at), 'dd/MM/yyyy HH:mm', { locale: id })}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {history.type === 'inbound' ? 'Masuk' :
                                                             history.type === 'outbound' ? 'Keluar' :
                                                             history.type === 'opname' ? 'Opname' :
                                                             history.type === 'mutation' ? 'Mutasi' : history.type}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                                                        {history.previous_qty?.toLocaleString() || 0}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                                                        {history.new_qty?.toLocaleString() || 0}
                                                    </TableCell>
                                                    <TableCell className="text-right font-mono">
                                                        <span className={
                                                            (history.new_qty || 0) > (history.previous_qty || 0)
                                                                ? 'text-green-600'
                                                                : (history.new_qty || 0) < (history.previous_qty || 0)
                                                                ? 'text-red-600'
                                                                : ''
                                                        }>
                                                            {((history.new_qty || 0) - (history.previous_qty || 0) > 0 ? '+' : '') +
                                                             ((history.new_qty || 0) - (history.previous_qty || 0)).toLocaleString()}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {history.reference_type && history.reference_id
                                                            ? `${history.reference_type} #${history.reference_id}`
                                                            : '-'
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {history.user?.name || '-'}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    Tidak ada riwayat perubahan
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}