import { useForm } from '@inertiajs/react';
import { Package, Save } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { Product, Category } from '@/types/models/products';

interface ProductFormModalProps {
    open: boolean;
    product?: Product | null;
    categories: Category[];
    onClose: () => void;
}

const UNITS = ['Karton', 'Box', 'Pcs', 'Liter', 'Kg', 'Meter', 'Buah', 'Lusin', 'Pack'];

export function ProductFormModal({ open, product, categories, onClose }: ProductFormModalProps) {
    const isEditing = !!product;

    const form = useForm({
        category_id: product?.category_id?.toString() || '',
        name: product?.name || '',
        unit: product?.unit || '',
        min_stock: product?.min_stock?.toString() || '',
        max_stock: product?.max_stock?.toString() || '',
        price: product?.price?.toString() || '',
        cost: product?.cost?.toString() || '',
        description: product?.description || '',
        is_active: product?.is_active ?? true,
    });

    useEffect(() => {
        if (product) {
            form.setData({
                category_id: product.category_id?.toString() || '',
                name: product.name,
                unit: product.unit,
                min_stock: product.min_stock?.toString() || '',
                max_stock: product.max_stock?.toString() || '',
                price: product.price?.toString() || '',
                cost: product.cost?.toString() || '',
                description: product.description || '',
                is_active: product.is_active,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);

    const handleClose = () => {
        form.reset();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            form.put(`/dashboard/products/${product.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                },
            });
        } else {
            form.post('/dashboard/products', {
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
                        icon={Package}
                        title={isEditing ? 'Edit Produk' : 'Tambah Produk'}
                        description={isEditing ? 'Perbarui informasi produk' : 'Tambahkan produk baru ke inventaris Anda'}
                    />
                    <div className="space-y-6 py-4">
                        {/* Row 1: Category & Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product-category">
                                    Kategori <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={form.data.category_id}
                                    onValueChange={(value) => form.setData('category_id', value)}
                                >
                                    <SelectTrigger id="product-category">
                                        <SelectValue placeholder="Pilih kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.category_id} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product-name">
                                    Nama Produk <span className="text-destructive">*</span>
                                </Label>
                                <Input
                                    id="product-name"
                                    value={form.data.name}
                                    onChange={(e) => form.setData('name', e.target.value)}
                                    placeholder="Contoh: Samsung Galaxy S24"
                                    required
                                    maxLength={255}
                                />
                                <InputError message={form.errors.name} />
                            </div>
                        </div>

                        {/* Row 2: Unit & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product-unit">
                                    Satuan <span className="text-destructive">*</span>
                                </Label>
                                <Select
                                    value={form.data.unit}
                                    onValueChange={(value) => form.setData('unit', value)}
                                >
                                    <SelectTrigger id="product-unit">
                                        <SelectValue placeholder="Pilih satuan" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UNITS.map((unit) => (
                                            <SelectItem key={unit} value={unit}>
                                                {unit}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.unit} />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-medium">Status</Label>
                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="product-is-active"
                                        checked={form.data.is_active}
                                        onChange={(e) => form.setData('is_active', e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <Label htmlFor="product-is-active" className="text-sm">
                                        Produk Aktif
                                    </Label>
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Stock Levels */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product-min-stock">Stok Minimum</Label>
                                <Input
                                    id="product-min-stock"
                                    type="number"
                                    value={form.data.min_stock}
                                    onChange={(e) => form.setData('min_stock', e.target.value.replace(/[^\d]/g, ''))}
                                    placeholder="0"
                                    min="0"
                                />
                                <InputError message={form.errors.min_stock} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product-max-stock">Stok Maksimum</Label>
                                <Input
                                    id="product-max-stock"
                                    type="number"
                                    value={form.data.max_stock}
                                    onChange={(e) => form.setData('max_stock', e.target.value.replace(/[^\d]/g, ''))}
                                    placeholder="0"
                                    min="0"
                                />
                                <InputError message={form.errors.max_stock} />
                            </div>
                        </div>

                        {/* Row 4: Pricing */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product-cost">Harga Modal</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                        Rp
                                    </span>
                                    <Input
                                        id="product-cost"
                                        type="number"
                                        value={form.data.cost}
                                        onChange={(e) => form.setData('cost', e.target.value)}
                                        step="0.01"
                                        placeholder="0"
                                        min="0"
                                        className="pl-8"
                                    />
                                </div>
                                <InputError message={form.errors.cost} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="product-price">Harga Jual</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                        Rp
                                    </span>
                                    <Input
                                        id="product-price"
                                        type="number"
                                        value={form.data.price}
                                        onChange={(e) => form.setData('price', e.target.value)}
                                        step="0.01"
                                        placeholder="0"
                                        min="0"
                                        className="pl-8"
                                    />
                                </div>
                                <InputError message={form.errors.price} />
                            </div>
                        </div>

                        {/* Row 5: Description */}
                        <div className="space-y-2">
                            <Label htmlFor="product-description">Deskripsi</Label>
                            <textarea
                                id="product-description"
                                value={form.data.description}
                                onChange={(e) => form.setData('description', e.target.value)}
                                placeholder="Deskripsi produk (opsional)"
                                rows={2}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none"
                                maxLength={1000}
                            />
                            <InputError message={form.errors.description} />
                        </div>

                        {/* Info for new products */}
                        {!isEditing && (
                            <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
                                <p className="text-sm text-blue-800">
                                    <span className="font-medium">Kode produk</span> akan dibuat otomatis dengan format <span className="font-mono">PRD-XXXXXX</span>
                                </p>
                            </div>
                        )}
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
                            {form.processing
                                ? (isEditing ? 'Memperbarui...' : 'Menyimpan...')
                                : (isEditing ? 'Perbarui' : 'Simpan')
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
