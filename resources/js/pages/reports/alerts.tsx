import { Head } from '@inertiajs/react';
import { AlertTriangle, PackageX } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Reports', href: '/dashboard/reports' },
    { title: 'Stock Alerts', href: '/dashboard/reports/alerts' },
];

interface Alert {
    type: 'low_stock' | 'out_of_stock';
    message: string;
    current_qty: number;
    min_stock: number;
    unit: string;
}

interface Props {
    alerts: {
        low_stock: Alert[];
        out_of_stock: Alert[];
        total_alerts: number;
    };
}

export default function StockAlerts({ alerts }: Props) {
    const getAlertIcon = (type: string) => {
        switch (type) {
            case 'low_stock':
                return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
            case 'out_of_stock':
                return <PackageX className="h-5 w-5 text-red-600" />;
            default:
                return null;
        }
    };

    const getAlertBadge = (type: string) => {
        switch (type) {
            case 'low_stock':
                return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Stok Rendah</Badge>;
            case 'out_of_stock':
                return <Badge variant="destructive">Stok Habis</Badge>;
            default:
                return <Badge variant="outline">{type}</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Alerts" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Notifikasi Stok</h1>
                        <p className="text-sm text-muted-foreground">
                            Total alert: {alerts.total_alerts} item
                        </p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stok Rendah</CardTitle>
                            <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{alerts.low_stock.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Item dengan stok di bawah minimum
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Stok Habis</CardTitle>
                            <PackageX className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{alerts.out_of_stock.length}</div>
                            <p className="text-xs text-muted-foreground">
                                Item dengan stok kosong
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Low Stock Alerts */}
                {alerts.low_stock.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                Stok Rendah
                            </CardTitle>
                            <CardDescription>
                                Item yang perlu segera diisi ulang
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {alerts.low_stock.map((alert, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {getAlertIcon(alert.type)}
                                            <div>
                                                <p className="font-medium">{alert.message}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Stok saat ini: {alert.current_qty} {alert.unit} (Min: {alert.min_stock} {alert.unit})
                                                </p>
                                            </div>
                                        </div>
                                        {getAlertBadge(alert.type)}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Out of Stock Alerts */}
                {alerts.out_of_stock.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PackageX className="h-5 w-5 text-red-600" />
                                Stok Habis
                            </CardTitle>
                            <CardDescription>
                                Item yang sudah tidak tersedia dan perlu segera diisi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {alerts.out_of_stock.map((alert, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            {getAlertIcon(alert.type)}
                                            <div>
                                                <p className="font-medium">{alert.message}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    Stok saat ini: {alert.current_qty} {alert.unit} (Min: {alert.min_stock} {alert.unit})
                                                </p>
                                            </div>
                                        </div>
                                        {getAlertBadge(alert.type)}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* No Alerts */}
                {alerts.total_alerts === 0 && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <div className="rounded-full bg-green-100 p-3">
                                <PackageX className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold">Semua Stok Normal</h3>
                            <p className="mt-2 text-center text-sm text-muted-foreground">
                                Tidak ada item yang perlu perhatian khusus. Semua stok dalam kondisi baik.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
