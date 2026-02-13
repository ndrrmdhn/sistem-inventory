export interface StockHistory {
    id: number;
    stock_id: number;
    warehouse_id: number;
    product_id: number;
    previous_qty: number;
    new_qty: number;
    change_qty: number;
    reference_type: 'inbound' | 'outbound' | 'mutation_sent' | 'mutation_received' | 'adjustment' | 'opname';
    reference_id: number;
    reference_code: string;
    notes: string | null;
    created_by: number;
    created_at: string;
    updated_at: string;
    warehouse: {
        id: number;
        name: string;
        code: string;
    };
    product: {
        id: number;
        name: string;
        code: string;
        unit: string;
    };
    creator: {
        id: number;
        name: string;
        email: string;
    };
}

export interface Filters {
    search?: string;
    warehouse_id?: string;
    product_id?: string;
    reference_type?: string;
    start_date?: string;
    end_date?: string;
}

export interface PageProps {
    current_page: number;
    data: StockHistory[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface StockHistoryTableProps {
    stockHistories: StockHistory[];
    isLoading: boolean;
}

export interface StockHistoryToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onClearFilters: () => void;
    isSearching: boolean;
    hasActiveFilters: boolean;
    filters: Filters;
    warehouses: Array<{ id: number; name: string }>;
    products: Array<{ id: number; name: string }>;
    onWarehouseChange?: (value: string) => void;
    onProductChange?: (value: string) => void;
    onReferenceTypeChange?: (value: string) => void;
}
