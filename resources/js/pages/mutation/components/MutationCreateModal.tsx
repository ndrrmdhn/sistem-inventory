import { useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Package, Warehouse as WarehouseIcon } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
import type { MutationCreateModalProps } from '@/types/models/mutation';

interface MutationCreateModalPropsExtended extends MutationCreateModalProps {
    warehouses: Array<{ id: number; name: string }>;
    products: Array<{ id: number; name: string }>;
    stocks: Array<{
        id: number;
        warehouse_id: number;
        product_id: number;
        quantity: number;
        product: { id: number; name: string };
        warehouse: { id: number; name: string };
    }>;
}

export function MutationCreateModal({
    open,
    onClose,
    warehouses,
    products,
    stocks,
}: MutationCreateModalPropsExtended) {
    const [fromWarehouseSearchOpen, setFromWarehouseSearchOpen] = useState(false);
    const [toWarehouseSearchOpen, setToWarehouseSearchOpen] = useState(false);
    const [productSearchOpen, setProductSearchOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        from_warehouse: '',
        to_warehouse: '',
        product_id: '',
        quantity: '',
        notes: '',
    });

    const selectedFromWarehouse = useMemo(
        () => warehouses.find((w) => w.id.toString() === data.from_warehouse),
        [data.from_warehouse, warehouses]
    );

    const selectedToWarehouse = useMemo(
        () => warehouses.find((w) => w.id.toString() === data.to_warehouse),
        [data.to_warehouse, warehouses]
    );

    const selectedProduct = useMemo(
        () => products.find((p) => p.id.toString() === data.product_id),
        [data.product_id, products]
    );

    // Filter products based on selected from_warehouse and available stock
    const availableProducts = useMemo(() => {
        if (!data.from_warehouse) {
            return products; // Show all products if no from warehouse selected
        }

        // Get product IDs that have stock in the selected from warehouse
        const stockedProductIds = stocks
            .filter(stock => stock.warehouse_id.toString() === data.from_warehouse && stock.quantity > 0)
            .map(stock => stock.product_id);

        // Return products that have stock in the selected from warehouse
        return products.filter(product => stockedProductIds.includes(product.id));
    }, [data.from_warehouse, products, stocks]);

    // Reset product selection when from warehouse changes
    useEffect(() => {
        if (data.from_warehouse && data.product_id) {
            const isProductAvailable = availableProducts.some(p => p.id.toString() === data.product_id);
            if (!isProductAvailable) {
                setData('product_id', '');
            }
        }
    }, [data.from_warehouse, data.product_id, availableProducts]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/mutations', {
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
                    <DialogTitle>Buat Mutasi</DialogTitle>
                    <DialogDescription>
                        Buat permintaan mutasi stok antar gudang.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="from_warehouse">Dari Gudang</Label>
                                <Popover open={fromWarehouseSearchOpen} onOpenChange={setFromWarehouseSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={fromWarehouseSearchOpen}
                                            className="w-full justify-between"
                                        >
                                            {selectedFromWarehouse ? (
                                                <div className="flex items-center gap-2">
                                                    <WarehouseIcon className="h-4 w-4" />
                                                    {selectedFromWarehouse.name}
                                                </div>
                                            ) : (
                                                "Pilih Gudang Asal"
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari gudang asal..." />
                                            <CommandList>
                                                <CommandEmpty>Gudang tidak ditemukan</CommandEmpty>
                                                <CommandGroup>
                                                    {warehouses.map((warehouse) => (
                                                        <CommandItem
                                                            key={warehouse.id}
                                                            value={warehouse.name}
                                                            onSelect={() => {
                                                                setData('from_warehouse', warehouse.id.toString());
                                                                setFromWarehouseSearchOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    data.from_warehouse === warehouse.id.toString()
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
                                {errors.from_warehouse && <p className="text-sm text-destructive">{errors.from_warehouse}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="to_warehouse">Ke Gudang</Label>
                                <Popover open={toWarehouseSearchOpen} onOpenChange={setToWarehouseSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={toWarehouseSearchOpen}
                                            className="w-full justify-between"
                                        >
                                            {selectedToWarehouse ? (
                                                <div className="flex items-center gap-2">
                                                    <WarehouseIcon className="h-4 w-4" />
                                                    {selectedToWarehouse.name}
                                                </div>
                                            ) : (
                                                "Pilih Gudang Tujuan"
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari gudang tujuan..." />
                                            <CommandList>
                                                <CommandEmpty>Gudang tidak ditemukan</CommandEmpty>
                                                <CommandGroup>
                                                    {warehouses.map((warehouse) => (
                                                        <CommandItem
                                                            key={warehouse.id}
                                                            value={warehouse.name}
                                                            onSelect={() => {
                                                                setData('to_warehouse', warehouse.id.toString());
                                                                setToWarehouseSearchOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    data.to_warehouse === warehouse.id.toString()
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
                                {errors.to_warehouse && <p className="text-sm text-destructive">{errors.to_warehouse}</p>}
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
                                            disabled={!data.from_warehouse}
                                        >
                                            {selectedProduct ? (
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    {selectedProduct.name}
                                                </div>
                                            ) : (
                                                data.from_warehouse
                                                    ? "Pilih Produk"
                                                    : "Pilih Gudang Asal terlebih dahulu"
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari produk..." />
                                            <CommandList>
                                                <CommandEmpty>
                                                    {data.from_warehouse
                                                        ? "Tidak ada produk dengan stok di gudang ini"
                                                        : "Pilih gudang asal terlebih dahulu"
                                                    }
                                                </CommandEmpty>
                                                <CommandGroup>
                                                    {availableProducts.map((product) => (
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
                                <Label htmlFor="quantity">Jumlah</Label>
                                <Input
                                    id="quantity"
                                    type="number"
                                    min="1"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    placeholder="Masukkan jumlah"
                                />
                                {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
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
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : 'Buat Mutasi'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
