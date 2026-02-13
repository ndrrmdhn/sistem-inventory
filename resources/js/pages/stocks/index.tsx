import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Pagination } from '@/components/pagination';
import { useGenericModals } from '@/hooks/useGenericModals';
import { useSearch } from '@/hooks/useSearch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Stock, StockHistory, StockFilters, PageProps } from '@/types/models/stocks';
import { StocksModals } from './components/StocksModals';
import { StocksTable } from './components/StocksTable';
import { StocksToolbar } from './components/StocksToolbar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Stok', href: '/dashboard/stocks' },
];

export default function Index({
    stocks,
    warehouses,
    products,
    filters = {},
}: {
    stocks: PageProps;
    warehouses: Array<{ id: number; name: string }>;
    products: Array<{ id: number; name: string }>;
    filters?: StockFilters;
}) {
    const [isLoading, setIsLoading] = useState(false);

    const { searchValue, setSearchValue, clearSearch, isSearching, hasActiveSearch } = useSearch({
        route: '/dashboard/stocks',
        initialSearch: filters.search || '',
        only: ['stocks'],
    });

    const { modals, openModal, closeModal } = useGenericModals<Stock>({
        simple: [],
        withData: ['show']
    });

    const clearFilters = () => {
        clearSearch();
        // TODO: clear other filters
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stok" />
            <div className="p-6">
                <StocksToolbar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onClearFilters={clearFilters}
                    isSearching={isSearching}
                    hasActiveFilters={hasActiveSearch}
                    filters={filters}
                    warehouses={warehouses}
                    products={products}
                />

                <StocksTable
                    stocks={stocks.data}
                    isLoading={isLoading}
                    onShowStock={(stock) => openModal('show', stock)}
                />

                {stocks.last_page > 1 && (
                    <div className="mt-6">
                        <Pagination
                            links={stocks.links}
                            meta={{
                                current_page: stocks.current_page,
                                last_page: stocks.last_page,
                                per_page: stocks.per_page,
                                total: stocks.total,
                                from: stocks.from,
                                to: stocks.to,
                            }}
                        />
                    </div>
                )}

                <StocksModals
                    showModal={modals.show}
                    selectedStock={modals.selectedData}
                    onCloseShowModal={() => closeModal('show')}
                />
            </div>
        </AppLayout>
    );
}