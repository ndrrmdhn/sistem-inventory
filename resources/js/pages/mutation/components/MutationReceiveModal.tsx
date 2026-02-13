import React from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { StockMutation } from '@/types/models/mutation';

interface MutationReceiveModalProps {
    open: boolean;
    mutation: StockMutation | null;
    onClose: () => void;
}

export function MutationReceiveModal({
    open,
    mutation,
    onClose,
}: MutationReceiveModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        received_qty: mutation?.quantity || '',
        damaged_qty: '',
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/dashboard/mutations/${mutation?.id}/receive`, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleReject = () => {
        post(`/dashboard/mutations/${mutation?.id}/reject`, {
            data: { notes: data.notes },
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    // Reset form when mutation changes
    React.useEffect(() => {
        if (mutation) {
            setData({
                received_qty: mutation.quantity,
                damaged_qty: '',
                notes: '',
            });
        }
    }, [mutation]);

    if (!mutation) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Terima Mutasi - {mutation.code}</DialogTitle>
                    <DialogDescription>
                        Konfirmasi penerimaan barang dari {mutation.from_warehouse?.name} ke {mutation.to_warehouse?.name}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Produk</label>
                                <p className="text-sm font-medium">{mutation.product?.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Jumlah Dikirim</label>
                                <p className="text-sm font-medium">{mutation.quantity} {mutation.product?.unit}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="received_qty">Jumlah Diterima</Label>
                                <Input
                                    id="received_qty"
                                    type="number"
                                    step="0.01"
                                    value={data.received_qty}
                                    onChange={(e) => setData('received_qty', e.target.value)}
                                    placeholder="0.00"
                                />
                                {errors.received_qty && <p className="text-sm text-destructive">{errors.received_qty}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="damaged_qty">Jumlah Rusak</Label>
                                <Input
                                    id="damaged_qty"
                                    type="number"
                                    step="0.01"
                                    value={data.damaged_qty}
                                    onChange={(e) => setData('damaged_qty', e.target.value)}
                                    placeholder="0.00"
                                />
                                {errors.damaged_qty && <p className="text-sm text-destructive">{errors.damaged_qty}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Catatan</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Catatan tambahan (opsional)"
                                rows={3}
                            />
                            {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                        </div>

                        <div className="bg-muted p-3 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                Total diterima: <span className="font-medium">
                                    {(parseFloat(data.received_qty || '0') + parseFloat(data.damaged_qty || '0')).toFixed(2)} {mutation.product?.unit}
                                </span>
                                {parseFloat(data.received_qty || '0') + parseFloat(data.damaged_qty || '0') !== mutation.quantity && (
                                    <span className="text-orange-600 ml-2">
                                        (Selisih: {(parseFloat(data.received_qty || '0') + parseFloat(data.damaged_qty || '0') - mutation.quantity).toFixed(2)})
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleReject}
                            disabled={processing}
                            className="text-destructive hover:text-destructive"
                        >
                            Tolak
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Memproses...' : 'Terima'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
