import { Head, Link } from '@inertiajs/react';
import {
    Package,
    Warehouse,
    TrendingUp,
    AlertTriangle,
    PackageX,
    ArrowUpRight,
    ArrowDownLeft,
    ArrowRightLeft,
    BarChart3,
    FileText,
    Bell
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { EmployeesList } from '@/pages/dashboard/EmployeesList';
import { ProductsList } from '@/pages/dashboard/ProductsList';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

interface DashboardProps {
    products: Array<{
        id: number;
        code: string;
        name: string;
        unit: string;
        price: number;
        is_active: boolean;
        category?: {
            name: string;
        };
    }>;
    employees: Array<{
        id: number;
        name: string;
        email: string;
        role?: string;
        is_active: boolean;
        created_at: string;
    }>;
    stockSummary: {
        total_products: number;
        total_warehouses: number;
        total_stock_value: number;
        low_stock_count: number;
        out_of_stock_count: number;
    };
    recentTransactions: Array<{
        type: 'inbound' | 'outbound' | 'mutation';
        code: string;
        date: string;
        product: string;
        warehouse?: string;
        supplier?: string;
        customer?: string;
        from_warehouse?: string;
        to_warehouse?: string;
        quantity: number;
        status?: string;
    }>;
    stockAlerts: Array<{
        type: 'low_stock' | 'out_of_stock';
        message: string;
        current_qty: number;
        min_stock: number;
        unit: string;
    }>;
    monthlyChart: Array<{
        month: string;
        inbound: number;
        outbound: number;
    }>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    products,
    employees,
    stockSummary,
    recentTransactions,
    stockAlerts,
}: DashboardProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const getTransactionIcon = (type: string) => {
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

    const getTransactionBadge = (type: string) => {
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Dashboard GudangKu</h1>
                        <p className="text-muted-foreground">Ringkasan inventory dan aktivitas terbaru</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/reports/stock">
                                <FileText className="mr-2 h-4 w-4" />
                                Laporan Stok
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/dashboard/reports/alerts">
                                <Bell className="mr-2 h-4 w-4" />
                                Notifikasi
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Stock Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stockSummary.total_products}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Gudang</CardTitle>
                            <Warehouse className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stockSummary.total_warehouses}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Nilai Stok</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(stockSummary.total_stock_value)}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stockSummary.low_stock_count}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stok Habis</CardTitle>
                            <PackageX className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{stockSummary.out_of_stock_count}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts and Recent Activity */}
                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Monthly Chart Placeholder */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Tren Bulanan
                            </CardTitle>
                            <CardDescription>
                                Pergerakan barang masuk dan keluar per bulan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64 flex items-center justify-center text-muted-foreground">
                                Chart akan ditampilkan di sini (menggunakan library chart)
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Transactions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Aktivitas Terbaru</CardTitle>
                            <CardDescription>
                                Transaksi terakhir dalam sistem
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentTransactions.map((transaction, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="mt-1">
                                            {getTransactionIcon(transaction.type)}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium">{transaction.product}</p>
                                                {getTransactionBadge(transaction.type)}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {transaction.type === 'mutation' ? (
                                                    `${transaction.from_warehouse} → ${transaction.to_warehouse}`
                                                ) : (
                                                    transaction.warehouse
                                                )}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {transaction.code} • Qty: {transaction.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stock Alerts */}
                {stockAlerts.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5 text-orange-600" />
                                Peringatan Stok
                            </CardTitle>
                            <CardDescription>
                                Item yang perlu perhatian segera
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {stockAlerts.slice(0, 3).map((alert, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {alert.type === 'low_stock' ? (
                                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                                            ) : (
                                                <PackageX className="h-4 w-4 text-red-600" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium">{alert.message}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Stok: {alert.current_qty} {alert.unit} (Min: {alert.min_stock})
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={alert.type === 'low_stock' ? 'secondary' : 'destructive'}>
                                            {alert.type === 'low_stock' ? 'Rendah' : 'Habis'}
                                        </Badge>
                                    </div>
                                ))}
                                {stockAlerts.length > 3 && (
                                    <div className="text-center pt-2">
                                        <Button variant="outline" size="sm" asChild>
                                            <Link href="/dashboard/reports/alerts">
                                                Lihat Semua ({stockAlerts.length})
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Products and Employees Grid */}
                <div className="grid gap-6 lg:grid-cols-2">
                    <ProductsList products={products} />
                    <EmployeesList employees={employees} />
                </div>
            </div>
        </AppLayout>
    );
}
