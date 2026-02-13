import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Package,
    Boxes,
    Settings2,
    FileText
} from 'lucide-react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';

import { useAuth } from '@/hooks/use-auth';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { isSuperAdmin } = useAuth();

    // 1. Menu Utama (Tanpa Dropdown)
    const topNavItems: NavItem[] = [
        {
            title: 'Beranda',
            href: dashboard.url(),
            icon: LayoutGrid,
        },
    ];

    // 2. Kelompok Operasional (Dropdown)
    const operationalNavItems: NavItem[] = [
        {
            title: 'Manajemen Stok',
            href: '#',
            icon: Boxes,
            items: [
                { title: 'Barang Masuk', href: '/dashboard/inbound' },
                { title: 'Barang Keluar', href: '/dashboard/outbound' },
                { title: 'Opname Stok', href: '/dashboard/opname' },
                { title: 'Mutasi Antar Gudang', href: '/dashboard/mutations' },
                { title: 'Riwayat Stok', href: '/dashboard/stock-history' },
                { title: 'Stok Tersedia', href: '/dashboard/stocks' },
            ],
        },
    ];

    // 3. Kelompok Laporan (Dropdown)
    const reportNavItems: NavItem[] = [
        {
            title: 'Laporan & Analitik',
            href: '#',
            icon: FileText,
            items: [
                { title: 'Laporan Stok', href: '/dashboard/reports/stock' },
                { title: 'Laporan Transaksi', href: '/dashboard/reports/transactions' },
                { title: 'Laporan Peringatan', href: '/dashboard/reports/alerts' },
            ],
        },
    ];

    // 4. Kelompok Master Data (Dropdown - Super Admin Only)
    const masterDataNavItems: NavItem[] = isSuperAdmin ? [
        {
            title: 'Data Produk',
            href: '#',
            icon: Package,
            items: [
                { title: 'Daftar Produk', href: '/dashboard/products' },
                { title: 'Kategori Produk', href: '/dashboard/categories' },
                { title: 'Data Supplier', href: '/dashboard/suppliers' },
                { title: 'Data Customer', href: '/dashboard/customers' },
            ],
        },
        {
            title: 'Pengaturan Sistem',
            href: '#',
            icon: Settings2,
            items: [
                { title: 'Daftar Gudang', href: '/dashboard/warehouses' },
                { title: 'Data Karyawan', href: '/dashboard/employees' },
                { title: 'Penugasan Staf Gudang', href: '/dashboard/warehouse-users' },
            ],
        },
    ] : [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard.url()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="gap-0">
                {/* Bagian Beranda */}
                <NavMain items={topNavItems} />

                {/* Bagian Operasional (Dropdown) */}
                <NavMain title="Operasional" items={operationalNavItems} />

                {/* Bagian Laporan (Dropdown) */}
                <NavMain title="Laporan" items={reportNavItems} />

                {/* Bagian Master Data (Dropdown - Admin Only) */}
                {isSuperAdmin && (
                    <NavMain title="Master Data" items={masterDataNavItems} />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
