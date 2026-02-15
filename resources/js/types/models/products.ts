export interface Category {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    code: string;
    category_id: number;
    name: string;
    unit: string;
    min_stock: number;
    max_stock: number;
    price: number;
    cost: number;
    description?: string | null;
    is_active: boolean;
    category?: Category;
    created_at: string;
    updated_at: string;
    deleted_at?: string | null;
}

export interface Filters {
    search?: string;
}

export interface PageProps {
    data: Product[];
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
