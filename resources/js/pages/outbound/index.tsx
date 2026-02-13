import { Head } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { useGenericModals } from '@/hooks/useGenericModals';
import { useSearch } from '@/hooks/useSearch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { OutboundTransaction, Filters, PageProps } from '@/types/models/outbound';
import { OutboundModals } from './components/OutboundModals';
import { OutboundTable } from './components/OutboundTable';
import { OutboundToolbar } from './components/OutboundToolbar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Outbound', href: '/dashboard/outbound' },
];

export default function Index({
    outbounds,
    warehouses,
    customers,
    products,
    stocks,
    filters = {},
}: {
    outbounds: PageProps;
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
    filters?: Filters;
}) {
    const { searchValue, setSearchValue, clearSearch, isSearching, hasActiveSearch } = useSearch({
        route: '/dashboard/outbound',
        initialSearch: filters.search || '',
        only: ['outbounds'],
    });

    const { modals, openModal, closeModal } = useGenericModals<OutboundTransaction>({
        simple: ['create'],
        withData: ['show']
    });

    const clearFilters = () => {
        clearSearch();
        // TODO: clear other filters
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Outbound" />
            <div className="p-6">
                <OutboundToolbar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onAddClick={() => openModal('create')}
                    onClearFilters={clearFilters}
                    isSearching={isSearching}
                    hasActiveFilters={hasActiveSearch}
                    filters={filters}
                    warehouses={warehouses}
                />

                <OutboundTable
                    outbounds={outbounds.data}
                    onShow={(outbound) => openModal('show', outbound)}
                />

                {outbounds.last_page > 1 && (
                    <div className="mt-6">
                        <Pagination
                            links={outbounds.links}
                            meta={{
                                current_page: outbounds.current_page,
                                last_page: outbounds.last_page,
                                per_page: outbounds.per_page,
                                total: outbounds.total,
                                from: outbounds.from,
                                to: outbounds.to,
                            }}
                        />
                    </div>
                )}

                <OutboundModals
                    modals={modals}
                    onCloseModal={closeModal}
                    warehouses={warehouses}
                    customers={customers}
                    products={products}
                    stocks={stocks}
                />
            </div>
        </AppLayout>
    );
}
