export interface StockMutation {
    id: number;
    code: string;
    from_warehouse_id: number;
    to_warehouse_id: number;
    product_id: number;
    quantity: number;
    status: 'sent' | 'received' | 'rejected';
    sent_at: string;
    received_at?: string;
    rejected_at?: string;
    notes?: string;
    created_by: number;
    received_by?: number;
    created_at: string;
    updated_at: string;
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
    };
}

export interface MutationFilters {
    search?: string;
    status?: string;
    from_warehouse?: string;
    to_warehouse?: string;
    date_from?: string;
    date_to?: string;
}

export interface MutationStoreRequest {
    from_warehouse: string;
    to_warehouse: string;
    product_id: string;
    quantity: string;
    notes?: string;
}

export interface PageProps<T = any> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}
