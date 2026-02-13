import { useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Package, Truck, Warehouse as WarehouseIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
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
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { InboundFormModalProps } from '@/types/models/inbound';

interface InboundFormModalPropsExtended extends InboundFormModalProps {
    warehouses: Array<{ id: number; name: string }>;
    suppliers: Array<{ id: number; name: string }>;
    products: Array<{ id: number; name: string }>;
}

export function InboundFormModal({
    open,
    inbound,
    onClose,
    warehouses,
    suppliers,
    products,
}: InboundFormModalPropsExtended) {
    const [supplierSearchOpen, setSupplierSearchOpen] = useState(false);
    const [warehouseSearchOpen, setWarehouseSearchOpen] = useState(false);
    const [productSearchOpen, setProductSearchOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        supplier_id: inbound?.supplier_id || '',
        warehouse_id: inbound?.warehouse_id || '',
        product_id: inbound?.product_id || '',
        quantity: inbound?.quantity || '',
        unit_price: inbound?.unit_price || '',
        received_date: inbound?.received_date || new Date().toISOString().split('T')[0],
        notes: inbound?.notes || '',
    });

    const selectedSupplier = useMemo(
        () => suppliers.find((s) => s.id.toString() === data.supplier_id),
        [data.supplier_id, suppliers]
    );

    const selectedWarehouse = useMemo(
        () => warehouses.find((w) => w.id.toString() === data.warehouse_id),
        [data.warehouse_id, warehouses]
    );

    const selectedProduct = useMemo(
        () => products.find((p) => p.id.toString() === data.product_id),
        [data.product_id, products]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/inbound', {
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

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Tambah Inbound</DialogTitle>
                    <DialogDescription>
                        Tambahkan transaksi inbound baru.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="supplier_id">Supplier</Label>
                                <Popover open={supplierSearchOpen} onOpenChange={setSupplierSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={supplierSearchOpen}
                                            className="w-full justify-between"
                                        >
                                            {selectedSupplier ? (
                                                <div className="flex items-center gap-2">
                                                    <Truck className="h-4 w-4" />
                                                    {selectedSupplier.name}
                                                </div>
                                            ) : (
                                                "Pilih Supplier"
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari supplier..." />
                                            <CommandList>
                                                <CommandEmpty>Supplier tidak ditemukan</CommandEmpty>
                                                <CommandGroup>
                                                    {suppliers.map((supplier) => (
                                                        <CommandItem
                                                            key={supplier.id}
                                                            value={supplier.name}
                                                            onSelect={() => {
                                                                setData('supplier_id', supplier.id.toString());
                                                                setSupplierSearchOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    data.supplier_id === supplier.id.toString()
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            <Truck className="mr-2 h-4 w-4" />
                                                            {supplier.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.supplier_id && <p className="text-sm text-destructive">{errors.supplier_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="warehouse_id">Warehouse</Label>
                                <Popover open={warehouseSearchOpen} onOpenChange={setWarehouseSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={warehouseSearchOpen}
                                            className="w-full justify-between"
                                        >
                                            {selectedWarehouse ? (
                                                <div className="flex items-center gap-2">
                                                    <WarehouseIcon className="h-4 w-4" />
                                                    {selectedWarehouse.name}
                                                </div>
                                            ) : (
                                                "Pilih Warehouse"
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari warehouse..." />
                                            <CommandList>
                                                <CommandEmpty>Warehouse tidak ditemukan</CommandEmpty>
                                                <CommandGroup>
                                                    {warehouses.map((warehouse) => (
                                                        <CommandItem
                                                            key={warehouse.id}
                                                            value={warehouse.name}
                                                            onSelect={() => {
                                                                setData('warehouse_id', warehouse.id.toString());
                                                                setWarehouseSearchOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    data.warehouse_id === warehouse.id.toString()
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            <WarehouseIcon className="mr-2 h-4 w-4" />
                                                            {warehouse.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.warehouse_id && <p className="text-sm text-destructive">{errors.warehouse_id}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="product_id">Produk</Label>
                                <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={productSearchOpen}
                                            className="w-full justify-between"
                                        >
                                            {selectedProduct ? (
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    {selectedProduct.name}
                                                </div>
                                            ) : (
                                                "Pilih Produk"
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari produk..." />
                                            <CommandList>
                                                <CommandEmpty>Produk tidak ditemukan</CommandEmpty>
                                                <CommandGroup>
                                                    {products.map((product) => (
                                                        <CommandItem
                                                            key={product.id}
                                                            value={product.name}
                                                            onSelect={() => {
                                                                setData('product_id', product.id.toString());
                                                                setProductSearchOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    data.product_id === product.id.toString()
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            <Package className="mr-2 h-4 w-4" />
                                                            {product.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.product_id && <p className="text-sm text-destructive">{errors.product_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    placeholder="0"
                                />
                                {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="unit_price">Harga Satuan</Label>
                                <Input
                                    id="unit_price"
                                    type="number"
                                    step="0.01"
                                    value={data.unit_price}
                                    onChange={(e) => setData('unit_price', e.target.value)}
                                    placeholder="0.00"
                                />
                                {errors.unit_price && <p className="text-sm text-destructive">{errors.unit_price}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="received_date">Tanggal Penerimaan</Label>
                                <Input
                                    id="received_date"
                                    type="date"
                                    value={data.received_date}
                                    onChange={(e) => setData('received_date', e.target.value)}
                                />
                                {errors.received_date && <p className="text-sm text-destructive">{errors.received_date}</p>}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Catatan</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Catatan opsional..."
                                rows={3}
                            />
                            {errors.notes && <p className="text-sm text-destructive">{errors.notes}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Simpan'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
