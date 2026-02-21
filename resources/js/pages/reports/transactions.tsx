import { Head, router } from '@inertiajs/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Download, Filter, ArrowUpRight, ArrowDownLeft, ArrowRightLeft } from 'lucide-react';
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
import { exportMethod } from '@/routes/reports/transactions';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/dashboard/reports' },
    { title: 'Transaction Report', href: '/dashboard/reports/transactions' },
];

interface Warehouse {
    id: number;
    name: string;
}

interface Transaction {
    type: 'inbound' | 'outbound' | 'mutation';
    code: string;
    date: string;
    warehouse?: string;
    product: string;
    supplier?: string;
    customer?: string;
    from_warehouse?: string;
    to_warehouse?: string;
    quantity: number;
    received_qty?: number;
    unit_price?: number;
    total_price?: number;
    status?: string;
}

interface Filters {
    type?: string;
    warehouse_id?: string;
    start_date?: string;
    end_date?: string;
}

interface Props {
    transactionReport: {
        data: Transaction[];
        summary: {
            total_inbound: number;
            total_outbound: number;
            total_mutations: number;
            total_inbound_value: number;
            total_outbound_value: number;
            net_movement: number;
        };
        period: {
            start_date: string;
            end_date: string;
        };
    };
    warehouses: Warehouse[];
    filters: Filters;
}

export default function TransactionReport({ transactionReport, warehouses, filters }: Props) {
    const [selectedType, setSelectedType] = useState(filters.type || 'all');
    const [selectedWarehouse, setSelectedWarehouse] = useState(filters.warehouse_id || '');
    const [startDate, setStartDate] = useState(filters.start_date || format(new Date(), 'yyyy-MM-dd', { locale: id }));
    const [endDate, setEndDate] = useState(filters.end_date || format(new Date(), 'yyyy-MM-dd', { locale: id }));

    const handleFilter = () => {
        router.get('/dashboard/reports/transactions', {
            type: selectedType,
            warehouse_id: selectedWarehouse || undefined,
            start_date: startDate,
            end_date: endDate,
        }, {
            preserveState: true,
        });
    };

    const handleExport = (format: 'pdf' | 'excel') => {
        const params = {
            type: selectedType,
            warehouse_id: selectedWarehouse || undefined,
            start_date: startDate,
            end_date: endDate,
            format,
        };
        window.open(exportMethod.url({ query: params }));
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'inbound':
                return <ArrowDownLeft className="h-4 w-4 text-green-600" />;
            case 'outbound':
                return <ArrowUpRight className="h-4 w-4 text-red-600" />;
            case 'mutation':
                return <ArrowRightLeft className="h-4 w-4 text-blue-600" />;
            default:
                return null;
        }
    };

    const getTypeBadge = (type: string) => {
        switch (type) {
            case 'inbound':
                return <Badge variant="default" className="bg-green-100 text-green-800">Masuk</Badge>;
            case 'outbound':
                return <Badge variant="default" className="bg-red-100 text-red-800">Keluar</Badge>;
            case 'mutation':
                return <Badge variant="default" className="bg-blue-100 text-blue-800">Mutasi</Badge>;
            default:
                return <Badge variant="secondary">{type}</Badge>;
        }
    };

    const getStatusBadge = (status?: string) => {
        if (!status) return null;

        switch (status) {
            case 'dikirim':
                return <Badge variant="secondary">Dikirim</Badge>;
            case 'diterima':
                return <Badge variant="default">Diterima</Badge>;
            case 'selesai':
                return <Badge variant="default" className="bg-green-100 text-green-800">Selesai</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const formatCurrency = (amount?: number) => {
        if (!amount) return '-';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transaction Report" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Laporan Transaksi</h1>
                        <p className="text-sm text-muted-foreground">
                            Periode: {format(new Date(transactionReport.period.start_date), 'dd/MM/yyyy', { locale: id })} - {format(new Date(transactionReport.period.end_date), 'dd/MM/yyyy', { locale: id })}
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
                                <label className="text-sm font-medium">Tipe Transaksi</label>
                                <Select value={selectedType} onValueChange={setSelectedType}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Semua</SelectItem>
                                        <SelectItem value="inbound">Barang Masuk</SelectItem>
                                        <SelectItem value="outbound">Barang Keluar</SelectItem>
                                        <SelectItem value="mutation">Mutasi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
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
                            <CardTitle className="text-sm font-medium">Total Masuk</CardTitle>
                            <ArrowDownLeft className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{transactionReport.summary.total_inbound}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(transactionReport.summary.total_inbound_value)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Keluar</CardTitle>
                            <ArrowUpRight className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{transactionReport.summary.total_outbound}</div>
                            <p className="text-xs text-muted-foreground">
                                {formatCurrency(transactionReport.summary.total_outbound_value)}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Mutasi</CardTitle>
                            <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{transactionReport.summary.total_mutations}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Net Movement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className={`text-2xl font-bold ${transactionReport.summary.net_movement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {transactionReport.summary.net_movement >= 0 ? '+' : ''}{transactionReport.summary.net_movement}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Transaction Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Detail Transaksi</CardTitle>
                        <CardDescription>
                            Riwayat transaksi dalam periode yang dipilih
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tipe</TableHead>
                                    <TableHead>Kode</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                    <TableHead>Produk</TableHead>
                                    <TableHead>Gudang</TableHead>
                                    <TableHead>Qty</TableHead>
                                    <TableHead>Harga Satuan</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactionReport.data.map((transaction, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(transaction.type)}
                                                {getTypeBadge(transaction.type)}
                                            </div>
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="font-mono block truncate cursor-pointer">
                                                            {transaction.code}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {transaction.code}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell>{format(new Date(transaction.date), 'dd/MM/yyyy', { locale: id })}</TableCell>
                                        <TableCell className="max-w-xs">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span className="block truncate cursor-pointer">
                                                            {transaction.product}
                                                        </span>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {transaction.product}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>
                                        <TableCell className="max-w-xs">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="text-sm truncate block cursor-pointer">
                                                            {transaction.type === 'mutation'
                                                                ? `${transaction.from_warehouse} → ${transaction.to_warehouse}`
                                                                : transaction.warehouse}
                                                        </div>
                                                    </TooltipTrigger>

                                                    <TooltipContent side="top">
                                                        {transaction.type === 'mutation'
                                                            ? `${transaction.from_warehouse} → ${transaction.to_warehouse}`
                                                            : transaction.warehouse}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            {transaction.type === 'mutation' && transaction.received_qty !== undefined ? (
                                                <div className="text-sm">
                                                    <div>Dikirim: {transaction.quantity}</div>
                                                    <div>Diterima: {transaction.received_qty}</div>
                                                </div>
                                            ) : (
                                                transaction.quantity
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(transaction.unit_price)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {formatCurrency(transaction.total_price)}
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(transaction.status)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
