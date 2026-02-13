interface OutboundTransaction {
    id: number;
    code: string;
    customer_id: number;
    warehouse_id: number;
    product_id: number;
    quantity: number;
    unit_price: number | null;
    sale_date: string;
    notes: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    customer: {
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
    data: OutboundTransaction[];
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

interface OutboundFormModalProps {
    open: boolean;
    outbound?: OutboundTransaction | null;
    onClose: () => void;
}

interface OutboundTableProps {
    outbounds: OutboundTransaction[];
    onShow: (outbound: OutboundTransaction) => void;
}

interface OutboundToolbarProps {
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

export type { OutboundTransaction, PageProps, Filters, OutboundFormModalProps, OutboundTableProps, OutboundToolbarProps };