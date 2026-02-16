<?php

namespace App\Exports;

use App\Services\ReportService;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class TransactionReportExport implements FromCollection, WithHeadings, WithMapping, WithTitle, WithEvents
{
    protected $type;

    protected $warehouseId;

    protected $startDate;

    protected $endDate;

    protected $data;

    public function __construct(string $type, ?int $warehouseId, string $startDate, string $endDate)
    {
        $this->type = $type;
        $this->warehouseId = $warehouseId;
        $this->startDate = $startDate;
        $this->endDate = $endDate;

        $service = new ReportService;
        $report = $service->getTransactionReport($type, $warehouseId, $startDate, $endDate);
        $this->data = $report['data'];
    }

    public function collection()
    {
        return collect($this->data);
    }

    public function headings(): array
    {
        if ($this->type === 'inbound') {
            return [
                'Jenis',
                'Kode',
                'Tanggal',
                'Gudang',
                'Produk',
                'Supplier',
                'Qty',
                'Harga Satuan',
                'Total Harga',
            ];
        } elseif ($this->type === 'outbound') {
            return [
                'Jenis',
                'Kode',
                'Tanggal',
                'Gudang',
                'Produk',
                'Customer',
                'Qty',
                'Harga Satuan',
                'Total Harga',
            ];
        } elseif ($this->type === 'mutation') {
            return [
                'Jenis',
                'Kode',
                'Tanggal',
                'Dari Gudang',
                'Ke Gudang',
                'Produk',
                'Qty',
                'Qty Diterima',
                'Status',
            ];
        } else {
            // For 'all' type, use combined headings
            return [
                'Jenis',
                'Kode',
                'Tanggal',
                'Gudang/Dari',
                'Produk',
                'Supplier/Customer/Ke',
                'Qty',
                'Harga Satuan/Qty Diterima',
                'Total Harga/Status',
            ];
        }
    }

    public function map($row): array
    {
        if ($this->type === 'inbound') {
            return [
                $row['type'],
                $row['code'],
                $row['date'],
                $row['warehouse'],
                $row['product'],
                $row['supplier'],
                $row['quantity'],
                $row['unit_price'],
                $row['total_price'],
            ];
        } elseif ($this->type === 'outbound') {
            return [
                $row['type'],
                $row['code'],
                $row['date'],
                $row['warehouse'],
                $row['product'],
                $row['customer'],
                $row['quantity'],
                $row['unit_price'],
                $row['total_price'],
            ];
        } elseif ($this->type === 'mutation') {
            return [
                $row['type'],
                $row['code'],
                $row['date'],
                $row['from_warehouse'],
                $row['to_warehouse'],
                $row['product'],
                $row['quantity'],
                $row['received_qty'],
                $row['status'],
            ];
        } else {
            // For 'all' type
            if ($row['type'] === 'inbound') {
                return [
                    $row['type'],
                    $row['code'],
                    $row['date'],
                    $row['warehouse'],
                    $row['product'],
                    $row['supplier'],
                    $row['quantity'],
                    $row['unit_price'],
                    $row['total_price'],
                ];
            } elseif ($row['type'] === 'outbound') {
                return [
                    $row['type'],
                    $row['code'],
                    $row['date'],
                    $row['warehouse'],
                    $row['product'],
                    $row['customer'],
                    $row['quantity'],
                    $row['unit_price'],
                    $row['total_price'],
                ];
            } else {
                return [
                    $row['type'],
                    $row['code'],
                    $row['date'],
                    $row['from_warehouse'],
                    $row['product'],
                    $row['to_warehouse'],
                    $row['quantity'],
                    $row['received_qty'],
                    $row['status'],
                ];
            }
        }
    }

    public function title(): string
    {
        $typeName = match($this->type) {
            'inbound' => 'Masuk',
            'outbound' => 'Keluar',
            'mutation' => 'Mutasi',
            default => 'Semua Transaksi'
        };
        return 'Laporan Transaksi ' . $typeName . ' - PT Rizquna Berkah Mandiri';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet;

                // Add company name at the top
                $sheet->insertNewRowBefore(1, 2);
                $sheet->setCellValue('A1', 'PT Rizquna Berkah Mandiri');
                $sheet->setCellValue('A2', 'Laporan Transaksi');

                // Merge cells for title (assuming 9 columns max)
                $sheet->mergeCells('A1:I1');
                $sheet->mergeCells('A2:I2');

                // Style the title
                $sheet->getStyle('A1:I2')->getFont()->setBold(true)->setSize(14);
                $sheet->getStyle('A1:I2')->getAlignment()->setHorizontal('center');

                // Auto size columns
                foreach(range('A','I') as $columnID) {
                    $sheet->getColumnDimension($columnID)->setAutoSize(true);
                }

                // Style headers
                $sheet->getStyle('A3:I3')->getFont()->setBold(true);
                $sheet->getStyle('A3:I3')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('CCCCCC');
            },
        ];
    }
}
