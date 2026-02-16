import { useForm } from '@inertiajs/react';
import { Users, Save } from 'lucide-react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { ModalHeader } from '@/components/modal-header';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import type { Customer } from '@/types/models/customers';

interface CustomerFormModalProps {
    open: boolean;
    customer?: Customer | null;
    onClose: () => void;
}

export function CustomerFormModal({ open, customer, onClose }: CustomerFormModalProps) {
    const isEditing = !!customer;

    const form = useForm({
        code: customer?.code || '',
        name: customer?.name || '',
        contact_person: customer?.contact_person || '',
        phone: customer?.phone || '',
        email: customer?.email || '',
        address: customer?.address || '',
        is_active: customer?.is_active ?? true,
    });

    useEffect(() => {
        if (customer) {
            form.setData({
                code: customer.code,
                name: customer.name,
                contact_person: customer.contact_person || '',
                phone: customer.phone || '',
                email: customer.email || '',
                address: customer.address || '',
                is_active: customer.is_active,
            });
        }
    }, [customer]);

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            form.put(`/dashboard/customers/${customer.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            form.post('/dashboard/customers', {
                preserveScroll: true,
                onSuccess: () => {
                    form.reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <form onSubmit={handleSubmit}>
                    <ModalHeader
                        icon={Users}
                        title={isEditing ? 'Edit Customer' : 'Tambah Customer'}
                        description={isEditing ? 'Perbarui informasi customer' : 'Tambahkan customer baru ke inventaris Anda'}
                    />
                    <div className="space-y-6 py-4">
                        {/* Row 1: Code (Edit only) */}
                        {isEditing && (
                            <div className="space-y-2">
                                <Label htmlFor="customer-code">
                                    Kode Customer
                                </Label>
                                <Input
                                    id="customer-code"
                                    value={form.data.code}
                                    disabled
                                    className="font-mono bg-muted"
                                />
                            </div>
                        )}

                        {/* Row 2: Name & Contact Person */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customer-name">
                                    Nama Customer <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="customer-name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Contoh: Toko Sembako Makmur"
                                    required
                                    maxLength={100}
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customer-contact-person">
                                    Kontak Person
                                </Label>
                                <Input
                                    id="customer-contact-person"
                                    value={form.data.contact_person}
                                    onChange={(e) => form.setData('contact_person', e.target.value)}
                                    placeholder="Contoh: Ahmad Susanto"
                                    maxLength={100}
                                />
                                <InputError message={form.errors.contact_person} />
                            </div>
                        </div>

                        {/* Row 3: Phone & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customer-phone">
                                    Nomor Telepon
                                </Label>
                                <Input
                                    id="customer-phone"
                                    value={form.data.phone}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                    placeholder="Contoh: 081234567890"
                                    maxLength={20}
                                />
                                <InputError message={form.errors.phone} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="customer-email">
                                    Email
                                </Label>
                                <Input
                                    id="customer-email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    placeholder="Contoh: contact@tokomakmur.com"
                                    maxLength={100}
                                />
                                <InputError message={form.errors.email} />
                            </div>
                        </div>

                        {/* Row 4: Address */}
                        <div className="space-y-2">
                            <Label htmlFor="customer-address">
                                Alamat
                            </Label>
                            <Textarea
                                id="customer-address"
                                value={form.data.address}
                                onChange={(e) => form.setData('address', e.target.value)}
                                placeholder="Masukkan alamat lengkap customer"
                                rows={3}
                                maxLength={1000}
                            />
                            <InputError message={form.errors.address} />
                        </div>

                        {/* Row 5: Status */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="customer-is-active"
                                checked={form.data.is_active}
                                onCheckedChange={(checked) => form.setData('is_active', checked as boolean)}
                            />
                            <Label htmlFor="customer-is-active" className="text-sm font-medium">
                                Customer Aktif
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={form.processing}
                        >
                            Batal
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            <Save className="mr-2 h-4 w-4" />
                            {form.processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
