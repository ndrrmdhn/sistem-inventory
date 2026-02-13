import { Head, router } from '@inertiajs/react';
import { Pagination } from '@/components/pagination';
import { useGenericModals } from '@/hooks/useGenericModals';
import { useFilters } from '@/hooks/useFilters';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import type { Opname, Filters, PageProps } from '@/types/models/opname';
import { OpnameModals } from './components/OpnameModals';
import { OpnameTable } from './components/OpnameTable';
import { OpnameToolbar } from './components/OpnameToolbar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Opname', href: '/dashboard/opname' },
];

export default function Index({
    opnames,
    warehouses,
    products,
    stocks,
    initialFilters = {},
}: {
    opnames: PageProps;
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
        route: '/dashboard/opname',
        initialFilters: {
            search: initialFilters?.search || '',
            warehouse_id: initialFilters?.warehouse_id || '',
            difference_type: initialFilters?.difference_type || '',
        },
        only: ['opnames'],
    });

    const { modals, openModal, closeModal } = useGenericModals<Opname>({
        simple: ['create'],
        withData: ['show', 'approve']
    });

    const handleApprove = (opname: Opname) => {
        openModal('approve', opname);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Opname" />
            <div className="p-6">
                <OpnameToolbar
                    searchValue={filterState.search}
                    onSearchChange={(value) => setFilter('search', value)}
                    onAddClick={() => openModal('create')}
                    onClearFilters={clearFilters}
                    onWarehouseChange={(warehouseId) => setFilter('warehouse_id', warehouseId === 'all' ? '' : warehouseId)}
                    onDifferenceTypeChange={(differenceType) => setFilter('difference_type', differenceType === 'all' ? '' : differenceType)}
                    isSearching={isFiltering}
                    hasActiveFilters={hasActiveFilters}
                    filters={filterState}
                    warehouses={warehouses}
                />

                <OpnameTable
                    opnames={opnames.data}
                    onShow={(opname) => openModal('show', opname)}
                    onApprove={handleApprove}
                />

                {opnames.last_page > 1 && (
                    <div className="mt-6">
                        <Pagination
                            links={opnames.links}
                            meta={{
                                current_page: opnames.current_page,
                                last_page: opnames.last_page,
                                per_page: opnames.per_page,
                                total: opnames.total,
                                from: opnames.from,
                                to: opnames.to,
                            }}
                        />
                    </div>
                )}

                <OpnameModals
                    modals={modals}
                    onCloseModal={closeModal}
                    warehouses={warehouses}
                    products={products}
                    stocks={stocks}
                />
            </div>
        </AppLayout>
    );
}
