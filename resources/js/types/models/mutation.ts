export interface StockMutation {
    id: number;
    code: string;
    from_warehouse: number;
    to_warehouse: number;
    product_id: number;
    quantity: number;
    status: 'dikirim' | 'diterima' | 'ditolak' | 'selesai';
    status_display: 'sent' | 'received' | 'rejected' | 'completed';
    type: 'outgoing' | 'incoming';
    notes: string | null;
    sent_at: string | null;
    received_at: string | null;
    rejected_at: string | null;
    created_by: number;
    received_by: number | null;
    rejected_by: number | null;
    created_at: string;
    updated_at: string;
    fromWarehouse: {
        id: number;
        name: string;
        code: string;
    };
    toWarehouse: {
        id: number;
        name: string;
        code: string;
    };
    from_warehouse: {
        id: number;
        name: string;
        code: string;
    };
    to_warehouse: {
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
    creator: {
        id: number;
        name: string;
        email: string;
    };
    receiver?: {
        id: number;
        name: string;
        email: string;
    } | null;
    stockHistories?: StockHistory[];
}

export interface StockHistory {
    id: number;
    stock_id: number;
    warehouse_id: number;
    product_id: number;
    previous_qty: number;
    new_qty: number;
    change_qty: number;
    type: 'mutation_sent' | 'mutation_received' | 'adjustment';
    reference_type: 'mutation' | 'inbound' | 'outbound' | 'opname';
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

export interface Filters {
    search?: string;
    status?: string;
    type?: 'outgoing' | 'incoming';
}

export interface PageProps {
    current_page: number;
    data: StockMutation[];
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

export interface MutationToolbarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    onAddClick: () => void;
    onClearFilters: () => void;
    onStatusChange: (status: string) => void;
    onTypeChange: (type: string) => void;
    isSearching: boolean;
    hasActiveFilters: boolean;
    filters: Filters;
}

export interface MutationTableProps {
    mutations: StockMutation[];
    isLoading: boolean;
    onShowMutation: (mutation: StockMutation) => void;
    onReceiveMutation?: (mutation: StockMutation) => void;
    onRejectMutation?: (mutation: StockMutation) => void;
}

export interface MutationShowModalProps {
    mutation: StockMutation | null;
    isOpen: boolean;
    onClose: () => void;
}

export interface MutationCreateModalProps {
    open: boolean;
    onClose: () => void;
}

export interface MutationModalsProps {
    showModal: { isOpen: boolean; data: StockMutation | null };
    selectedMutation: StockMutation | null;
    onCloseShowModal: () => void;
    createModal: boolean;
    onCloseCreateModal: () => void;
    receiveModal: { isOpen: boolean; data: StockMutation | null };
    onCloseReceiveModal: () => void;
    rejectModal: { isOpen: boolean; data: StockMutation | null };
    onCloseRejectModal: () => void;
}
