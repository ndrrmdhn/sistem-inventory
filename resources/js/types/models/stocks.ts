export interface Stock {
    id: number;
    warehouse_id: number;
    product_id: number;
    quantity: number;
    reserved_qty: number;
    available_qty: number;
    min_stock: number;
    last_updated: string;
    updated_by: number | null;
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
        category?: {
            id: number;
            name: string;
        };
    };
    updater: {
        id: number;
        name: string;
        email: string;
    } | null;
    histories?: StockHistory[];
}

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
    creator: {
        id: number;
        name: string;
        email: string;
    };
}

export interface StockFilters {
    search?: string;
    warehouse_id?: string;
    product_id?: string;
}

export interface StocksToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onClearFilters: () => void;
    isSearching: boolean;
    hasActiveFilters: boolean;
    filters: StockFilters;
    warehouses: Array<{ id: number; name: string }>;
    products: Array<{ id: number; name: string }>;
}

export interface StocksTableProps {
    stocks: Stock[];
    isLoading: boolean;
    onShowStock: (stock: Stock) => void;
}

export interface StocksShowModalProps {
    stock: Stock | null;
    isOpen: boolean;
    onClose: () => void;
}

export interface StocksModalsProps {
    showModal: boolean;
    selectedStock: Stock | null;
    onCloseShowModal: () => void;
}