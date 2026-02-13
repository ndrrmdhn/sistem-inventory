import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { MutationShowModalProps } from '@/types/models/mutation';

export function MutationShowModal({
    mutation,
    isOpen,
    onClose,
}: MutationShowModalProps) {
    if (!mutation) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>Detail Mutasi - {mutation.code}</DialogTitle>
                </DialogHeader>

                <div className="max-h-[80vh] overflow-y-auto pr-4">
                    <div className="space-y-6">
                        {/* Mutation Information */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Kode</label>
                                <p className="text-sm font-medium">{mutation.code}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Status</label>
                                <Badge
                                    variant={
                                        mutation.status_display === 'pending' ? 'secondary' :
                                        mutation.status_display === 'sent' ? 'default' :
                                        mutation.status_display === 'received' ? 'default' :
                                        mutation.status_display === 'completed' ? 'default' :
                                        mutation.status_display === 'rejected' ? 'destructive' : 'secondary'
                                    }
                                >
                                    {mutation.status_display === 'pending' ? 'Pending' :
                                     mutation.status_display === 'sent' ? 'Dikirim' :
                                     mutation.status_display === 'received' ? 'Diterima' :
                                     mutation.status_display === 'completed' ? 'Selesai' :
                                     mutation.status_display === 'rejected' ? 'Ditolak' : mutation.status_display}
                                </Badge>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Produk</label>
                                <p className="text-sm font-medium">{mutation.product?.name || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Qty</label>
                                <p className="text-sm font-medium font-mono">{mutation.quantity?.toLocaleString() || 0}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Dari Gudang</label>
                                <p className="text-sm font-medium">{mutation.from_warehouse?.name || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Ke Gudang</label>
                                <p className="text-sm font-medium">{mutation.toWarehouse?.name || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Dibuat Oleh</label>
                                <p className="text-sm font-medium">{mutation.creator?.name || '-'}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Tanggal Dibuat</label>
                                <p className="text-sm font-medium">
                                    {format(new Date(mutation.created_at), 'dd MMMM yyyy HH:mm', { locale: id })}
                                </p>
                            </div>
                            {mutation.notes && (
                                <div className="col-span-2">
                                    <label className="text-sm font-medium text-muted-foreground">Catatan</label>
                                    <p className="text-sm font-medium">{mutation.notes}</p>
                                </div>
                            )}
                        </div>

                        {mutation.stockHistories && mutation.stockHistories.length > 0 && (
                            <>
                                <Separator />

                                {/* Stock History */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Riwayat Perubahan Stok</h3>

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
                                                {mutation.stockHistories.map((history) => (
                                                    <TableRow key={history.id}>
                                                        <TableCell>
                                                            {format(new Date(history.created_at), 'dd/MM/yyyy HH:mm', { locale: id })}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">
                                                                {history.type === 'mutation_sent' ? 'Mutasi Keluar' :
                                                                 history.type === 'mutation_received' ? 'Mutasi Masuk' : history.type}
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
                                                            {history.creator?.name || '-'}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
