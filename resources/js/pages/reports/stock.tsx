import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Download, Filter } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { exportMethod } from '@/routes/reports/stock';
import { type BreadcrumbItem } from '@/types';


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/dashboard/reports' },
    { title: 'Stock Report', href: '/dashboard/reports/stock' },
];

interface Warehouse {
    id: number;
    name: string;
}

interface StockItem {
    warehouse_name: string;
    product_code: string;
    product_name: string;
    unit: string;
    quantity: number;
    reserved_qty: number;
    available_qty: number;
    min_stock: number;
    max_stock: number;
    cost: number;
    value: number;
    status: 'normal' | 'low_stock' | 'out_of_stock';
}

interface Filters {
    warehouse_id?: string;
    start_date?: string;
    end_date?: string;
}

interface Props {
    stockReport: {
        data: StockItem[] | Record<string, StockItem[]>;
        summary: {
            total_items: number;
            total_value: number;
            low_stock_items: number;
            out_of_stock_items: number;
            warehouses_count: number;
        };
        period: {
            start_date: string;
            end_date: string;
        };
    };
    warehouses: Warehouse[];
    filters: Filters;
}

export default function StockReport({ stockReport, warehouses, filters }: Props) {
    const [selectedWarehouse, setSelectedWarehouse] = useState(filters.warehouse_id || '');
    const [startDate, setStartDate] = useState(filters.start_date || format(new Date(), 'yyyy-MM-dd', { locale: id }));
    const [endDate, setEndDate] = useState(filters.end_date || format(new Date(), 'yyyy-MM-dd', { locale: id }));

    const handleFilter = () => {
        router.get('/dashboard/reports/stock', {
            warehouse_id: selectedWarehouse || undefined,
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveState: true,
        });
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        const params = {
            warehouse_id: selectedWarehouse || undefined,
            start_date: startDate,
            end_date: endDate,
            format,
        };
        window.open(exportMethod.url({ query: params }));
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'out_of_stock':
                return <Badge variant="destructive">Habis</Badge>;
            case 'low_stock':
                return <Badge variant="secondary">Stok Rendah</Badge>;
            default:
                return <Badge variant="default">Normal</Badge>;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const renderStockTable = (data: StockItem[]) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Gudang</TableHead>
                    <TableHead>Kode Produk</TableHead>
                    <TableHead>Nama Produk</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Reserved</TableHead>
                    <TableHead className="text-right">Available</TableHead>
                    <TableHead className="text-right">Min Stock</TableHead>
                    <TableHead className="text-right">Cost</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell>{item.warehouse_name}</TableCell>
                        <TableCell className="max-w-xs">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="block truncate font-medium cursor-pointer">
                                            {item.product_code}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {item.product_code}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell className="max-w-xs">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <span className="block truncate cursor-pointer">
                                            {item.product_name}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        {item.product_name}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.reserved_qty}</TableCell>
                        <TableCell className="text-right">{item.available_qty}</TableCell>
                        <TableCell className="text-right">{item.min_stock}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.cost)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(item.value)}</TableCell>
                        <TableCell>{getStatusBadge(item.status)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Report" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Laporan Stok</h1>
                        <p className="text-sm text-muted-foreground">
                            Periode: {format(new Date(stockReport.period.start_date), 'dd/MM/yyyy', { locale: id })} - {format(new Date(stockReport.period.end_date), 'dd/MM/yyyy', { locale: id })}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => handleExport('pdf')}>
                            <Download className="mr-2 h-4 w-4" />
                            Export PDF
                        </Button>
                        <Button variant="outline" onClick={() => handleExport('excel')}>
                            <Download className="mr-2 h-4 w-4" />
                            Export Excel
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filter
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="text-sm font-medium">Gudang</label>
                                <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Semua Gudang" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua Gudang</SelectItem>
                                        {warehouses.map((warehouse) => (
                                            <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                                                {warehouse.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-medium">Tanggal Mulai</label>
                                <input
                                    type="date"
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="text-sm font-medium">Tanggal Akhir</label>
                                <input
                                    type="date"
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="flex items-end">
                                <Button onClick={handleFilter}>Terapkan Filter</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stockReport.summary.total_items}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="text-lg sm:text-xl md:text-2xl font-bold truncate cursor-pointer w-full">
                                            {formatCurrency(stockReport.summary.total_value)}
                                        </div>
                                    </TooltipTrigger>

                                    <TooltipContent side="top" className="font-semibold">
                                        {formatCurrency(stockReport.summary.total_value)}
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stockReport.summary.low_stock_items}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stok Habis</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stockReport.summary.out_of_stock_items}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stock Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detail Stok</CardTitle>
                        <CardDescription>
                            Data stok {selectedWarehouse ? 'per gudang' : 'semua gudang'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {Array.isArray(stockReport.data) ? (
                            renderStockTable(stockReport.data)
                        ) : (
                            Object.entries(stockReport.data).map(([warehouse, items]) => (
                                <div key={warehouse} className="mb-6">
                                    <h3 className="text-lg font-semibold mb-4">{warehouse}</h3>
                                    {renderStockTable(items as StockItem[])}
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
