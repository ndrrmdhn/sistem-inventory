import { Head } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { useGenericModals } from '@/hooks/useGenericModals';
import { useFilters } from '@/hooks/useFilters';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { StockMutation, Filters, PageProps } from '@/types/models/mutation';
import { MutationModals } from './components/MutationModals';
import { MutationTable } from './components/MutationTable';
import { MutationToolbar } from './components/MutationToolbar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Mutasi', href: '/dashboard/mutations' },
];

export default function Index({
    mutations,
    warehouses,
    products,
    stocks,
    initialFilters = {},
}: {
    mutations: PageProps;
    warehouses: Array<{ id: number; name: string }>;
    products: Array<{ id: number; name: string }>;
    stocks: Array<{
        id: number;
        warehouse_id: number;
        product_id: number;
        quantity: number;
        product: { id: number; name: string };
        warehouse: { id: number; name: string };
    }>;
    initialFilters?: Filters;
}) {
    const { filters: filterState, setFilter, clearFilters, isFiltering, hasActiveFilters } = useFilters({
        route: '/dashboard/mutations',
        initialFilters: {
            search: initialFilters?.search || '',
            status: initialFilters?.status || '',
            type: initialFilters?.type || '',
        },
        only: ['mutations'],
    });

    const { modals, openModal, closeModal } = useGenericModals<StockMutation>({
        simple: ['create'],
        withData: ['show', 'receive', 'reject']
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Mutasi" />
            <div className="p-6">
                <MutationToolbar
                    searchValue={filterState.search}
                    onSearchChange={(value) => setFilter('search', value)}
                    onAddClick={() => openModal('create')}
                    onClearFilters={clearFilters}
                    onStatusChange={(status) => setFilter('status', status === 'all' ? '' : status)}
                    onTypeChange={(type) => setFilter('type', type === 'all' ? '' : type)}
                    isSearching={isFiltering}
                    hasActiveFilters={hasActiveFilters}
                    filters={filterState}
                />

                <div className="space-y-6">
                    {/* Mutations Table */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Mutasi</h2>
                        <MutationTable
                            mutations={mutations.data}
                            isLoading={false}
                            onShowMutation={(mutation) => openModal('show', mutation)}
                            onReceiveMutation={(mutation) => openModal('receive', mutation)}
                            onRejectMutation={(mutation) => openModal('reject', mutation)}
                        />

                        {mutations.last_page > 1 && (
                            <div className="mt-6">
                                <Pagination
                                    links={mutations.links}
                                    meta={{
                                        current_page: mutations.current_page,
                                        last_page: mutations.last_page,
                                        per_page: mutations.per_page,
                                        total: mutations.total,
                                        from: mutations.from,
                                        to: mutations.to,
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <MutationModals
                    showModal={modals.show}
                    selectedMutation={null}
                    onCloseShowModal={() => closeModal('show')}
                    createModal={modals.create}
                    onCloseCreateModal={() => closeModal('create')}
                    receiveModal={modals.receive}
                    onCloseReceiveModal={() => closeModal('receive')}
                    rejectModal={modals.reject}
                    onCloseRejectModal={() => closeModal('reject')}
                    warehouses={warehouses}
                    products={products}
                    stocks={stocks}
                />
            </div>
        </AppLayout>
    );
}
