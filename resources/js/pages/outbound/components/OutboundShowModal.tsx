import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { OutboundTransaction } from '@/types/models/outbound';

interface OutboundShowModalProps {
    open: boolean;
    outbound: OutboundTransaction | null;
    onClose: () => void;
}

export function OutboundShowModal({
    open,
    outbound,
    onClose,
}: OutboundShowModalProps) {
    if (!outbound) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Detail Outbound</DialogTitle>
                    <DialogDescription>
                        Kode: <Badge variant="secondary">{outbound.code}</Badge>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Customer</Label>
                            <p className="text-sm text-muted-foreground">{outbound.customer.name}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Warehouse</Label>
                            <p className="text-sm text-muted-foreground">{outbound.warehouse.name}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Produk</Label>
                            <p className="text-sm text-muted-foreground">{outbound.product.name}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Quantity</Label>
                            <p className="text-sm text-muted-foreground">{outbound.quantity}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Harga Satuan</Label>
                            <p className="text-sm text-muted-foreground">
                                {outbound.unit_price ? `Rp ${outbound.unit_price.toLocaleString('id-ID')}` : '-'}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Total</Label>
                            <p className="text-sm text-muted-foreground">
                                {outbound.unit_price ? `Rp ${(outbound.quantity * outbound.unit_price).toLocaleString('id-ID')}` : '-'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Tanggal Penjualan</Label>
                        <p className="text-sm text-muted-foreground">
                            {new Date(outbound.sale_date).toLocaleDateString('id-ID')}
                        </p>
                    </div>
                    {outbound.notes && (
                        <div>
                            <Label className="text-sm font-medium">Catatan</Label>
                            <p className="text-sm text-muted-foreground">{outbound.notes}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Dibuat Oleh</Label>
                            <p className="text-sm text-muted-foreground">{outbound.creator.name}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Tanggal Dibuat</Label>
                            <p className="text-sm text-muted-foreground">
                                {new Date(outbound.created_at).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
