import { useForm } from '@inertiajs/react';
import { Users, Save } from 'lucide-react';
import { useEffect } from 'react';
import InputError from '@/components/input-error';
import { ModalHeader } from '@/components/modal-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { Supplier } from '@/types/models/suppliers';
interface SupplierFormModalProps {
    open: boolean;
    supplier?: Supplier | null;
    onClose: () => void;
}

export function SupplierFormModal({ open, supplier, onClose }: SupplierFormModalProps) {
    const isEditing = !!supplier;

    const form = useForm({
        code: supplier?.code || '',
        name: supplier?.name || '',
        contact_person: supplier?.contact_person || '',
        phone: supplier?.phone || '',
        email: supplier?.email || '',
        address: supplier?.address || '',
        tax_id: supplier?.tax_id || '',
        is_active: supplier?.is_active ?? true,
    });

    useEffect(() => {
        if (supplier) {
            form.setData({
                code: supplier.code,
                name: supplier.name,
                contact_person: supplier.contact_person,
                phone: supplier.phone,
                email: supplier.email,
                address: supplier.address,
                tax_id: supplier.tax_id,
                is_active: supplier.is_active,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supplier]);

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            form.put(`/dashboard/suppliers/${supplier.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            form.post('/dashboard/suppliers', {
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
                        title={isEditing ? 'Edit Supplier' : 'Tambah Supplier'}
                        description={isEditing ? 'Perbarui informasi supplier' : 'Tambahkan supplier baru ke inventaris Anda'}
                    />
                    <div className="space-y-6 py-4">
                        {/* Row 1: Code (Edit only) */}
                        {isEditing && (
                            <div className="space-y-2">
                                <Label htmlFor="supplier-code">
                                    Kode Supplier
                                </Label>
                                <Input
                                    id="supplier-code"
                                    value={form.data.code}
                                    disabled
                                    className="font-mono bg-muted"
                                />
                            </div>
                        )}

                        {/* Row 2: Name & Contact Person */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="supplier-name">
                                    Nama Supplier <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="supplier-name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Contoh: PT. Indofood Sukses Makmur"
                                    required
                                    maxLength={255}
                                />
                                <InputError message={form.errors.name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="supplier-contact-person">
                                    Kontak Person <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="supplier-contact-person"
                                    value={form.data.contact_person}
                                    onChange={(e) => form.setData('contact_person', e.target.value)}
                                    placeholder="Contoh: Budi Santoso"
                                    required
                                    maxLength={255}
                                />
                                <InputError message={form.errors.contact_person} />
                            </div>
                        </div>

                        {/* Row 3: Phone & Email */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="supplier-phone">
                                    Nomor Telepon
                                </Label>
                                <Input
                                    id="supplier-phone"
                                    type="tel"
                                    value={form.data.phone}
                                    onChange={(e) => form.setData('phone', e.target.value)}
                                    placeholder="Contoh: +62 812-3456-7890"
                                    maxLength={20}
                                />
                                <InputError message={form.errors.phone} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="supplier-email">
                                    Email
                                </Label>
                                <Input
                                    id="supplier-email"
                                    type="email"
                                    value={form.data.email}
                                    onChange={(e) => form.setData('email', e.target.value)}
                                    placeholder="Contoh: contact@supplier.com"
                                    maxLength={255}
                                />
                                <InputError message={form.errors.email} />
                            </div>
                        </div>

                        {/* Row 4: Tax ID */}
                        <div className="space-y-2">
                            <Label htmlFor="supplier-tax-id">
                                NPWP
                            </Label>
                            <Input
                                id="supplier-tax-id"
                                value={form.data.tax_id}
                                onChange={(e) => form.setData('tax_id', e.target.value.toUpperCase())}
                                placeholder="Contoh: NPWP-1234567890123456"
                                maxLength={50}
                                className="font-mono"
                            />
                            <InputError message={form.errors.tax_id} />
                        </div>

                        {/* Row 5: Address */}
                        <div className="space-y-2">
                            <Label htmlFor="supplier-address">
                                Alamat <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="supplier-address"
                                value={form.data.address}
                                onChange={(e) => form.setData('address', e.target.value)}
                                placeholder="Masukkan alamat lengkap supplier"
                                required
                                maxLength={1000}
                                rows={3}
                            />
                            <InputError message={form.errors.address} />
                        </div>

                        {/* Row 6: Status */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="supplier-is-active"
                                checked={form.data.is_active}
                                onCheckedChange={(checked) => form.setData('is_active', checked as boolean)}
                            />
                            <Label htmlFor="supplier-is-active" className="text-sm font-medium">
                                Supplier Aktif
                            </Label>
                        </div>
                        <InputError message={form.errors.is_active} />
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
