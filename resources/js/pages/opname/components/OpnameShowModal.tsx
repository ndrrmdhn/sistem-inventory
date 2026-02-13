import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {Label} from "@/components/ui/label";
import type { Opname } from '@/types/models/opname';

interface OpnameShowModalProps {
    open: boolean;
    opname: Opname | null;
    onClose: () => void;
}

export function OpnameShowModal({
    open,
    opname,
    onClose,
}: OpnameShowModalProps) {
    if (!opname) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Detail Opname</DialogTitle>
                    <DialogDescription>
                        Kode: <Badge variant="secondary">{opname.code}</Badge>
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Produk</Label>
                            <p className="text-sm text-muted-foreground">{opname.product.name}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Warehouse</Label>
                            <p className="text-sm text-muted-foreground">{opname.warehouse.name}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label className="text-sm font-medium">System Qty</Label>
                            <p className="text-sm text-muted-foreground">{opname.system_qty}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Physical Qty</Label>
                            <p className="text-sm text-muted-foreground">{opname.physical_qty}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Selisih</Label>
                            <p className={`text-sm font-medium ${opname.difference_type === 'lebih' ? 'text-green-600' : opname.difference_type === 'kurang' ? 'text-red-600' : 'text-gray-600'}`}>
                                {opname.difference_type === 'lebih' ? '+' : opname.difference_type === 'kurang' ? '-' : ''}{opname.difference_qty}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Status</Label>
                            <Badge variant={opname.status === 'approved' ? 'default' : 'secondary'}>
                                {opname.status === 'approved' ? 'Approved' : 'Draft'}
                            </Badge>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Tanggal Opname</Label>
                            <p className="text-sm text-muted-foreground">
                                {new Date(opname.opname_date).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>
                    {opname.notes && (
                        <div>
                            <Label className="text-sm font-medium">Catatan</Label>
                            <p className="text-sm text-muted-foreground">{opname.notes}</p>
                        </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-sm font-medium">Dibuat Oleh</Label>
                            <p className="text-sm text-muted-foreground">{opname.creator.name}</p>
                        </div>
                        <div>
                            <Label className="text-sm font-medium">Tanggal Dibuat</Label>
                            <p className="text-sm text-muted-foreground">
                                {new Date(opname.created_at).toLocaleDateString('id-ID')}
                            </p>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
