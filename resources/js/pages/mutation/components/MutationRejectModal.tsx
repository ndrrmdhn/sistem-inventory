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
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { StockMutation } from '@/types/models/mutation';

interface MutationRejectModalProps {
    open: boolean;
    mutation: StockMutation | null;
    onClose: () => void;
}

export function MutationRejectModal({
    open,
    mutation,
    onClose,
}: MutationRejectModalProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        notes: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/dashboard/mutations/${mutation?.id}/reject`, {
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

    // Reset form when mutation changes
    React.useEffect(() => {
        if (mutation) {
            setData({
                notes: '',
            });
        }
    }, [mutation]);

    if (!mutation) return null;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Tolak Mutasi - {mutation.code}</DialogTitle>
                    <DialogDescription>
                        Tolak mutasi dari {mutation.from_warehouse?.name} ke {mutation.to_warehouse?.name}
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
                                <label className="text-sm font-medium text-muted-foreground">Jumlah</label>
                                <p className="text-sm font-medium">{mutation.quantity} {mutation.product?.unit}</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="notes">Alasan Penolakan</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Berikan alasan penolakan (opsional)"
                                rows={3}
                            />
                            {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {processing ? 'Memproses...' : 'Tolak Mutasi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
