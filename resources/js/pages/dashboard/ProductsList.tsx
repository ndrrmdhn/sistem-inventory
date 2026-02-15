import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Users } from 'lucide-react';

interface Product {
    id: number;
    code: string;
    name: string;
    unit: string;
    price: number;
    is_active: boolean;
    category?: {
        name: string;
    };
}

interface ProductsListProps {
    products: Product[];
}

export function ProductsList({ products }: ProductsListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Produk Terbaru
                </CardTitle>
                <CardDescription>
                    {products.length} produk terdaftar dalam sistem
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {products.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Belum ada produk terdaftar
                        </div>
                    ) : (
                        products.slice(0, 5).map((product) => (
                            <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                        <Package className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{product.name}</div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Badge variant="secondary" className="font-mono text-xs">
                                                {product.code}
                                            </Badge>
                                            <span>•</span>
                                            <span>{product.category?.name}</span>
                                            <span>•</span>
                                            <span>{product.unit}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">
                                        Rp {product.price?.toLocaleString('id-ID') || '0'}
                                    </div>
                                    <Badge
                                        variant={product.is_active ? "default" : "secondary"}
                                        className="text-xs"
                                    >
                                        {product.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
