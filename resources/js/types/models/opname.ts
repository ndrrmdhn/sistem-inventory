interface Opname {
    id: number;
    code: string;
    warehouse_id: number;
    product_id: number;
    system_qty: number;
    physical_qty: number;
    difference_qty: number;
    difference_type: 'lebih' | 'kurang' | 'sama';
    status: 'draft' | 'approved';
    opname_date: string;
    notes: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    warehouse: {
        id: number;
        name: string;
    };
    product: {
        id: number;
        name: string;
    };
    creator: {
        id: number;
        name: string;
    };
}

interface PageProps {
    data: Opname[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface Filters {
    search?: string;
    warehouse_id?: string;
    difference_type?: string;
}

interface OpnameFormModalProps {
    open: boolean;
    opname?: Opname | null;
    onClose: () => void;
}

interface OpnameTableProps {
    opnames: Opname[];
    onShow: (opname: Opname) => void;
    onApprove?: (opname: Opname) => void;
}

interface OpnameToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
    onClearFilters: () => void;
    onWarehouseChange: (warehouseId: string) => void;
    onDifferenceTypeChange: (differenceType: string) => void;
    isSearching: boolean;
    hasActiveFilters: boolean;
    filters: Filters;
    warehouses: Array<{
        id: number;
        name: string;
    }>;
}

export type { Opname, PageProps, Filters, OpnameFormModalProps, OpnameTableProps, OpnameToolbarProps };
