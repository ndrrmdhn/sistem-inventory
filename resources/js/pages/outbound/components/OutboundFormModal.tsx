import { useForm } from '@inertiajs/react';
import { Check, ChevronsUpDown, Package, ShoppingCart, Warehouse as WarehouseIcon } from 'lucide-react';
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
import type { OutboundFormModalProps } from '@/types/models/outbound';

interface OutboundFormModalPropsExtended extends OutboundFormModalProps {
    warehouses: Array<{ id: number; name: string }>;
    customers: Array<{ id: number; name: string }>;
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

export function OutboundFormModal({
    open,
    outbound,
    onClose,
    warehouses,
    customers,
    products,
    stocks,
}: OutboundFormModalPropsExtended) {
    const [customerSearchOpen, setCustomerSearchOpen] = useState(false);
    const [warehouseSearchOpen, setWarehouseSearchOpen] = useState(false);
    const [productSearchOpen, setProductSearchOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_id: outbound?.customer_id || '',
        warehouse_id: outbound?.warehouse_id || '',
        product_id: outbound?.product_id || '',
        quantity: outbound?.quantity || '',
        unit_price: outbound?.unit_price || '',
        sale_date: outbound?.sale_date || new Date().toISOString().split('T')[0],
        notes: outbound?.notes || '',
        attachment: null as File | null,
    });

    const selectedCustomer = useMemo(
        () => customers.find((c) => c.id.toString() === data.customer_id),
        [data.customer_id, customers]
    );

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

        // Get product IDs that have stock in the selected warehouse
        const stockedProductIds = stocks
            .filter(stock => stock.warehouse_id.toString() === data.warehouse_id && stock.quantity > 0)
            .map(stock => stock.product_id);

        // Return products that have stock in the selected warehouse
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

    // Live preview for total (quantity * unit_price) — keeps unit_price as user input
    const previewTotal = (() => {
        const qty = Number(String(data.quantity)) || 0;
        const price = Number(String(data.unit_price)) || 0;
        return qty * price;
    })();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/dashboard/outbound', {
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
            <DialogContent className="sm:max-w-150">
                <DialogHeader>
                    <DialogTitle>{outbound ? 'Edit Outbound' : 'Tambah Outbound'}</DialogTitle>
                    <DialogDescription>
                        {outbound ? 'Edit detail transaksi outbound.' : 'Tambahkan transaksi outbound baru.'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="customer_id">Customer</Label>
                                <Popover open={customerSearchOpen} onOpenChange={setCustomerSearchOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={customerSearchOpen}
                                            className="w-full justify-between"
                                        >
                                            {selectedCustomer ? (
                                                <div className="flex items-center gap-2">
                                                    <ShoppingCart className="h-4 w-4" />
                                                    {selectedCustomer.name}
                                                </div>
                                            ) : (
                                                "Pilih Customer"
                                            )}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Cari customer..." />
                                            <CommandList>
                                                <CommandEmpty>Customer tidak ditemukan</CommandEmpty>
                                                <CommandGroup>
                                                    {customers.map((customer) => (
                                                        <CommandItem
                                                            key={customer.id}
                                                            value={customer.name}
                                                            onSelect={() => {
                                                                setData('customer_id', customer.id.toString());
                                                                setCustomerSearchOpen(false);
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    data.customer_id === customer.id.toString()
                                                                        ? "opacity-100"
                                                                        : "opacity-0"
                                                                )}
                                                            />
                                                            <ShoppingCart className="mr-2 h-4 w-4" />
                                                            {customer.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                {errors.customer_id && <p className="text-sm text-destructive">{errors.customer_id}</p>}
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
                                                        ? "Tidak ada produk dengan stok di gudang ini"
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

                                {/* Live total preview */}
                                <div className="flex items-center justify-between mt-2">
                                    <p className="text-sm text-muted-foreground">Total (preview)</p>
                                    <p className="text-sm font-medium">
                                        {previewTotal > 0 ? `Rp ${previewTotal.toLocaleString('id-ID')}` : '-'}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="sale_date">Tanggal Penjualan</Label>
                                <Input
                                    id="sale_date"
                                    type="date"
                                    value={data.sale_date}
                                    onChange={(e) => setData('sale_date', e.target.value)}
                                />
                                {errors.sale_date && <p className="text-sm text-destructive">{errors.sale_date}</p>}
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
                        <div className="space-y-2">
                            <Label htmlFor="attachment">Lampiran (PDF/Gambar)</Label>
                            <Input
                                id="attachment"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) => setData('attachment', e.target.files?.[0] || null)}
                            />
                            <p className="text-sm text-muted-foreground">
                                Upload surat jalan atau invoice (maksimal 2MB)
                            </p>
                            {errors.attachment && <p className="text-sm text-destructive">{errors.attachment}</p>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose}>
                            Batal
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Menyimpan...' : (outbound ? 'Update' : 'Simpan')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
