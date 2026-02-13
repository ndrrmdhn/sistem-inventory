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
import type { OpnameFormModalProps } from '@/types/models/opname';

interface OpnameFormModalPropsExtended extends OpnameFormModalProps {
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

export function OpnameFormModal({
    open,
    opname,
    onClose,
    warehouses,
    products,
    stocks,
}: OpnameFormModalPropsExtended) {
    const [warehouseSearchOpen, setWarehouseSearchOpen] = useState(false);
    const [productSearchOpen, setProductSearchOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        warehouse_id: opname?.warehouse_id || '',
        product_id: opname?.product_id || '',
        physical_qty: opname?.physical_qty || '',
        opname_date: opname?.opname_date || new Date().toISOString().split('T')[0],
        notes: opname?.notes || '',
    });

    const selectedWarehouse = useMemo(
        () => warehouses.find((w) => w.id.toString() === data.warehouse_id),
        [data.warehouse_id, warehouses]
    );

    const selectedProduct = useMemo(
        () => products.find((p) => p.id.toString() === data.product_id),
        [data.product_id, products]
    );

    // Filter products based on selected warehouse and available stock
    const availableProducts = useMemo(() => {
        if (!data.warehouse_id) {
            return products; // Show all products if no warehouse selected
        }

        // Get product IDs that exist in the selected warehouse (including 0 stock for opname)
        const stockedProductIds = stocks
            .filter(stock => stock.warehouse_id.toString() === data.warehouse_id)
            .map(stock => stock.product_id);

        // Return products that exist in the selected warehouse
        return products.filter(product => stockedProductIds.includes(product.id));
    }, [data.warehouse_id, products, stocks]);

    // Reset product selection when warehouse changes
    useEffect(() => {
        if (data.warehouse_id && data.product_id) {
            const isProductAvailable = availableProducts.some(p => p.id.toString() === data.product_id);
            if (!isProductAvailable) {
                setData('product_id', '');
            }
        }
    }, [data.warehouse_id, data.product_id, availableProducts]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/opname', {
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
                    <DialogTitle>Tambah Opname</DialogTitle>
                    <DialogDescription>
                        Tambahkan opname stok baru.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
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
                            <div className="space-y-2">
                                <Label htmlFor="product_id">Produk</Label>
                                <Popover open={productSearchOpen} onOpenChange={setProductSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={productSearchOpen}
                                            className="w-full justify-between"
                                            disabled={!data.warehouse_id}
                                        >
                                            {selectedProduct ? (
                                                <div className="flex items-center gap-2">
                                                    <Package className="h-4 w-4" />
                                                    {selectedProduct.name}
                                                </div>
                                            ) : (
                                                data.warehouse_id
                                                    ? "Pilih Produk"
                                                    : "Pilih Gudang terlebih dahulu"
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari produk..." />
                                            <CommandList>
                                                <CommandEmpty>
                                                    {data.warehouse_id
                                                        ? "Tidak ada produk di gudang ini"
                                                        : "Pilih gudang terlebih dahulu"
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
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="physical_qty">Jumlah Fisik</Label>
                                <Input
                                    id="physical_qty"
                                    type="number"
                                    value={data.physical_qty}
                                    onChange={(e) => setData('physical_qty', e.target.value)}
                                    placeholder="0"
                                />
                                {errors.physical_qty && <p className="text-sm text-destructive">{errors.physical_qty}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="opname_date">Tanggal Opname</Label>
                                <Input
                                    id="opname_date"
                                    type="date"
                                    value={data.opname_date}
                                    onChange={(e) => setData('opname_date', e.target.value)}
                                />
                                {errors.opname_date && <p className="text-sm text-destructive">{errors.opname_date}</p>}
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
