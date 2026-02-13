import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { InboundTransaction } from '@/types/models/inbound';

interface InboundShowModalProps {
    open: boolean;
    inbound: InboundTransaction | null;
    onClose: () => void;
}

export function InboundShowModal({
    open,
    inbound,
    onClose,
}: InboundShowModalProps) {
    if (!inbound) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Detail Inbound</DialogTitle>
                    <DialogDescription>
                        Kode: <Badge variant="secondary">{inbound.code}</Badge>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Supplier</Label>
                            <p className="text-sm text-muted-foreground">{inbound.supplier.name}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Warehouse</Label>
                            <p className="text-sm text-muted-foreground">{inbound.warehouse.name}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Produk</Label>
                            <p className="text-sm text-muted-foreground">{inbound.product.name}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Quantity</Label>
                            <p className="text-sm text-muted-foreground">{inbound.quantity}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Harga Satuan</Label>
                            <p className="text-sm text-muted-foreground">
                                {inbound.unit_price ? `Rp ${inbound.unit_price.toLocaleString('id-ID')}` : '-'}
                            </p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Total</Label>
                            <p className="text-sm text-muted-foreground">
                                {inbound.unit_price ? `Rp ${(inbound.quantity * inbound.unit_price).toLocaleString('id-ID')}` : '-'}
                            </p>
                        </div>
                    </div>
                    <div>
                        <Label className="text-sm font-medium">Tanggal Penerimaan</Label>
                        <p className="text-sm text-muted-foreground">
                            {new Date(inbound.received_date).toLocaleDateString('id-ID')}
                        </p>
                    </div>
                    {inbound.notes && (
                        <div>
                            <Label className="text-sm font-medium">Catatan</Label>
                            <p className="text-sm text-muted-foreground">{inbound.notes}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Dibuat Oleh</Label>
                            <p className="text-sm text-muted-foreground">{inbound.creator.name}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Tanggal Dibuat</Label>
                            <p className="text-sm text-muted-foreground">
                                {new Date(inbound.created_at).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
