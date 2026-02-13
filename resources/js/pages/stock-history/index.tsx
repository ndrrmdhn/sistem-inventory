import { Head } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { useFilters } from '@/hooks/useFilters';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { StockHistoryTable } from './components/StockHistoryTable';
import { StockHistoryToolbar } from './components/StockHistoryToolbar';
import type {  Filters, PageProps } from '@/types/models/stock-history';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stock History', href: '/dashboard/stock-history' },
];

export default function Index({
    stockHistories,
    warehouses,
    products,
    initialFilters = {},
}: {
    stockHistories: PageProps;
    warehouses: Array<{ id: number; name: string }>;
    products: Array<{ id: number; name: string }>;
    initialFilters?: Filters;
}) {
    const { filters: filterState, setFilter, clearFilters, isFiltering, hasActiveFilters } = useFilters({
        route: '/dashboard/stock-history',
        initialFilters: {
            search: initialFilters?.search || '',
            warehouse_id: initialFilters?.warehouse_id || '',
            product_id: initialFilters?.product_id || '',
            reference_type: initialFilters?.reference_type || '',
            start_date: initialFilters?.start_date || '',
            end_date: initialFilters?.end_date || '',
        },
        only: ['stockHistories'],
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock History" />
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold">Stock History</h1>
                    <p className="text-muted-foreground">
                        Riwayat perubahan stok semua produk di semua gudang
                    </p>
                </div>

                <StockHistoryToolbar
                    searchValue={filterState.search}
                    onSearchChange={(value) => setFilter('search', value)}
                    onClearFilters={clearFilters}
                    isSearching={isFiltering}
                    hasActiveFilters={hasActiveFilters}
                    filters={filterState}
                    warehouses={warehouses}
                    products={products}
                    onWarehouseChange={(value) => setFilter('warehouse_id', value === 'all' ? '' : value)}
                    onProductChange={(value) => setFilter('product_id', value === 'all' ? '' : value)}
                    onReferenceTypeChange={(value) => setFilter('reference_type', value === 'all' ? '' : value)}
                />

                <StockHistoryTable
                    stockHistories={stockHistories.data}
                    isLoading={false}
                />

                {stockHistories.last_page > 1 && (
                    <div className="mt-6">
                        <Pagination
                            links={stockHistories.links}
                            meta={{
                                current_page: stockHistories.current_page,
                                last_page: stockHistories.last_page,
                                per_page: stockHistories.per_page,
                                total: stockHistories.total,
                                from: stockHistories.from,
                                to: stockHistories.to,
                            }}
                        />
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
