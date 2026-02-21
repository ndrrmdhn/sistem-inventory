import { Users, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface Employee {
    id: number;
    name: string;
    email: string;
    role?: string;
    is_active: boolean;
    created_at: string;
}

interface EmployeesListProps {
    employees: Employee[];
}

export function EmployeesList({ employees }: EmployeesListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Karyawan Terbaru
                </CardTitle>
                <CardDescription>
                    {employees.length} karyawan terdaftar dalam sistem
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {employees.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Belum ada karyawan terdaftar
                        </div>
                    ) : (
                        employees.slice(0, 5).map((employee) => (
                            <div key={employee.id} className="flex items-center justify-between p-3 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <div className="font-medium">{employee.name}</div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <span>{employee.email}</span>
                                            {employee.role && (
                                                <>
                                                    <span>•</span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {employee.role}
                                                    </Badge>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <Badge
                                        variant={employee.is_active ? "default" : "secondary"}
                                        className="text-xs"
                                    >
                                        {employee.is_active ? 'Aktif' : 'Tidak Aktif'}
                                    </Badge>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {new Date(employee.created_at).toLocaleDateString('id-ID')}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
