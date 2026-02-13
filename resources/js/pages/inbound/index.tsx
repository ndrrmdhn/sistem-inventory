import { Head } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { useGenericModals } from '@/hooks/useGenericModals';
import { useSearch } from '@/hooks/useSearch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { InboundTransaction, Filters, PageProps } from '@/types/models/inbound';
import { InboundModals } from './components/InboundModals';
import { InboundTable } from './components/InboundTable';
import { InboundToolbar } from './components/InboundToolbar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Inbound', href: '/dashboard/inbound' },
];

export default function Index({
    inbounds,
    warehouses,
    suppliers,
    products,
    filters = {},
}: {
    inbounds: PageProps;
    warehouses: Array<{ id: number; name: string }>;
    suppliers: Array<{ id: number; name: string }>;
    products: Array<{ id: number; name: string }>;
    filters?: Filters;
}) {
    const { searchValue, setSearchValue, clearSearch, isSearching, hasActiveSearch } = useSearch({
        route: '/dashboard/inbound',
        initialSearch: filters.search || '',
        only: ['inbounds'],
    });

    const { modals, openModal, closeModal } = useGenericModals<InboundTransaction>({
        simple: ['create'],
        withData: ['show']
    });

    const clearFilters = () => {
        clearSearch();
        // TODO: clear other filters
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inbound" />
            <div className="p-6">
                <InboundToolbar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    onAddClick={() => openModal('create')}
                    onClearFilters={clearFilters}
                    isSearching={isSearching}
                    hasActiveFilters={hasActiveSearch}
                    filters={filters}
                    warehouses={warehouses}
                />

                <InboundTable
                    inbounds={inbounds.data}
                    onShow={(inbound) => openModal('show', inbound)}
                />

                {inbounds.last_page > 1 && (
                    <div className="mt-6">
                        <Pagination
                            links={inbounds.links}
                            meta={{
                                current_page: inbounds.current_page,
                                last_page: inbounds.last_page,
                                per_page: inbounds.per_page,
                                total: inbounds.total,
                                from: inbounds.from,
                                to: inbounds.to,
                            }}
                        />
                    </div>
                )}

                <InboundModals
                    modals={modals}
                    onCloseModal={closeModal}
                    warehouses={warehouses}
                    suppliers={suppliers}
                    products={products}
                />
            </div>
        </AppLayout>
    );
}