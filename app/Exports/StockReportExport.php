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

class StockReportExport implements FromCollection, WithHeadings, WithMapping, WithTitle, WithEvents
{
    protected $warehouseId;

    protected $startDate;

    protected $endDate;

    protected $data;

    public function __construct(?int $warehouseId, string $startDate, string $endDate)
    {
        $this->warehouseId = $warehouseId;
        $this->startDate = $startDate;
        $this->endDate = $endDate;

        $service = new ReportService;
        $report = $service->getStockReport($warehouseId, $startDate, $endDate);
        $this->data = $report['data'];
    }

    public function collection()
    {
        if ($this->warehouseId) {
            return collect($this->data);
        } else {
            $flattened = [];
            foreach ($this->data as $warehouse => $stocks) {
                foreach ($stocks as $stock) {
                    $flattened[] = $stock;
                }
            }

            return collect($flattened);
        }
    }

    public function headings(): array
    {
        return [
            'Gudang',
            'Kode Produk',
            'Nama Produk',
            'Satuan',
            'Qty',
            'Qty Dipesan',
            'Qty Tersedia',
            'Min Stock',
            'Max Stock',
            'Harga',
            'Nilai',
            'Status',
        ];
    }

    public function map($row): array
    {
        return [
            $row['warehouse_name'],
            $row['product_code'],
            $row['product_name'],
            $row['unit'],
            $row['quantity'],
            $row['reserved_qty'],
            $row['available_qty'],
            $row['min_stock'],
            $row['max_stock'],
            $row['cost'],
            $row['value'],
            $row['status'],
        ];
    }

    public function title(): string
    {
        return 'Laporan Stok - PT Rizquna Berkah Mandiri';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function(AfterSheet $event) {
                $sheet = $event->sheet;

                // Add company name at the top
                $sheet->insertNewRowBefore(1, 2);
                $sheet->setCellValue('A1', 'PT Rizquna Berkah Mandiri');
                $sheet->setCellValue('A2', 'Laporan Stok');

                // Merge cells for title
                $sheet->mergeCells('A1:L1');
                $sheet->mergeCells('A2:L2');

                // Style the title
                $sheet->getStyle('A1:L2')->getFont()->setBold(true)->setSize(14);
                $sheet->getStyle('A1:L2')->getAlignment()->setHorizontal('center');

                // Auto size columns
                foreach(range('A','L') as $columnID) {
                    $sheet->getColumnDimension($columnID)->setAutoSize(true);
                }

                // Style headers
                $sheet->getStyle('A3:L3')->getFont()->setBold(true);
                $sheet->getStyle('A3:L3')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('CCCCCC');
            },
        ];
    }
}
