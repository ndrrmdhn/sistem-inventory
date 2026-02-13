interface InboundTransaction {
    id: number;
    code: string;
    supplier_id: number;
    warehouse_id: number;
    product_id: number;
    quantity: number;
    unit_price: number | null;
    receipt_date: string;
    notes: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    supplier: {
        id: number;
        name: string;
    };
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
    data: InboundTransaction[];
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
    start_date?: string;
    end_date?: string;
}

interface InboundFormModalProps {
    open: boolean;
    inbound?: InboundTransaction | null;
    onClose: () => void;
}

interface InboundTableProps {
    inbounds: InboundTransaction[];
    onShow: (inbound: InboundTransaction) => void;
}

interface InboundToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
    onClearFilters: () => void;
    isSearching: boolean;
    hasActiveFilters: boolean;
    filters: Filters;
    warehouses: Array<{
        id: number;
        name: string;
    }>;
}

export type { InboundTransaction, PageProps, Filters, InboundFormModalProps, InboundTableProps, InboundToolbarProps };