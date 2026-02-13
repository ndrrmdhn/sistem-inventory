import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { MutationTableProps } from '@/types/models/mutation';

export function MutationTable({
    mutations,
    isLoading,
    onShowMutation,
    onReceiveMutation,
    onRejectMutation,
}: MutationTableProps) {
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="text-sm text-muted-foreground">Memuat data...</div>
            </div>
        );
    }

    if (mutations.length === 0) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="text-sm text-muted-foreground">
                    Tidak ada data mutasi
                </div>
            </div>
        );
    }

    return (
        <div className="border rounded-lg">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Kode</TableHead>
                        <TableHead>Tipe</TableHead>
                        <TableHead>Produk</TableHead>
                        <TableHead>Gudang</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Tanggal</TableHead>
                        <TableHead className="w-25">Aksi</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {mutations.map((mutation) => (
                        <TableRow key={mutation.id}>
                            <TableCell className="font-medium">{mutation.code}</TableCell>
                            <TableCell>
                                <Badge variant={mutation.type === 'outgoing' ? 'default' : 'secondary'}>
                                    {mutation.type === 'outgoing' ? 'Keluar' : 'Masuk'}
                                </Badge>
                            </TableCell>
                            <TableCell>{mutation.product?.name || '-'}</TableCell>
                            <TableCell>
                                {mutation.type === 'outgoing'
                                    ? mutation.to_warehouse?.name || '-'
                                    : mutation.from_warehouse?.name || '-'
                                }
                            </TableCell>
                            <TableCell className="text-right font-mono">
                                {mutation.quantity?.toLocaleString() || 0}
                            </TableCell>
                            <TableCell>
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
                            </TableCell>
                            <TableCell className="text-sm">
                                {new Date(mutation.created_at).toLocaleDateString('id-ID')}
                            </TableCell>
                            <TableCell>
                                <div className="flex gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onShowMutation(mutation)}
                                        className="h-8 w-8 p-0"
                                    >
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                    {mutation.type === 'incoming' && mutation.status_display === 'sent' && onReceiveMutation && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onReceiveMutation(mutation)}
                                            className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                        >
                                            <CheckCircle className="h-4 w-4" />
                                        </Button>
                                    )}
                                    {mutation.type === 'incoming' && mutation.status_display === 'sent' && onRejectMutation && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onRejectMutation(mutation)}
                                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                        >
                                            <XCircle className="h-4 w-4" />
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
