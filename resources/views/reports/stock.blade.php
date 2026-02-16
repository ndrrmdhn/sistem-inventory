<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stock Report</title>
    <style>
        @page {
            margin: 1in;
            size: A4;
        }
        body {
            font-family: 'DejaVu Sans', 'Arial', sans-serif;
            font-size: 10px;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 15px;
        }
        .company-name {
            font-size: 18px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
        }
        .report-title {
            font-size: 16px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        .report-info {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 5px;
        }
        .summary {
            display: table;
            width: 100%;
            margin-bottom: 25px;
            border-collapse: separate;
            border-spacing: 10px 0;
        }
        .summary-row {
            display: table-row;
        }
        .summary-item {
            display: table-cell;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 12px;
            text-align: center;
            width: 25%;
            vertical-align: middle;
        }
        .summary-label {
            font-size: 9px;
            color: #64748b;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
        }
        .summary-value {
            font-size: 14px;
            font-weight: bold;
            color: #1f2937;
        }
        .summary-value.currency {
            color: #059669;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            font-size: 9px;
            background: white;
        }
        th {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: white;
            padding: 10px 6px;
            text-align: left;
            font-weight: 600;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 1px solid #1e40af;
        }
        th.text-right {
            text-align: right;
        }
        td {
            padding: 8px 6px;
            border: 1px solid #e2e8f0;
            vertical-align: top;
        }
        td.text-right {
            text-align: right;
        }
        tr:nth-child(even) {
            background-color: #f8fafc;
        }
        tr:hover {
            background-color: #f1f5f9;
        }
        .status-normal {
            color: #059669;
            font-weight: 600;
        }
        .status-low_stock {
            color: #d97706;
            font-weight: 600;
        }
        .status-out_of_stock {
            color: #dc2626;
            font-weight: 600;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 8px;
            color: #9ca3af;
        }
        .warehouse-group {
            background: #f1f5f9;
            font-weight: bold;
            color: #374151;
        }
        .warehouse-group td {
            padding: 12px 6px;
            font-size: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">PT. GudangKu Indonesia</div>
        <div class="report-title">Laporan Stok Barang</div>
        <div class="report-info">
            Periode: {{ \Carbon\Carbon::parse($stockReport['period']['start_date'])->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($stockReport['period']['end_date'])->format('d/m/Y') }}
        </div>
        @if($warehouseId)
            <div class="report-info">Gudang: {{ $warehouse ? $warehouse->name : 'Semua Gudang' }}</div>
        @endif
    </div>

    <div class="summary">
        <div class="summary-row">
            <div class="summary-item">
                <div class="summary-label">Total Item</div>
                <div class="summary-value">{{ $stockReport['summary']['total_items'] }}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Nilai</div>
                <div class="summary-value currency">Rp {{ number_format($stockReport['summary']['total_value'], 0, ',', '.') }}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Stok Rendah</div>
                <div class="summary-value">{{ $stockReport['summary']['low_stock_items'] }}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Stok Habis</div>
                <div class="summary-value">{{ $stockReport['summary']['out_of_stock_items'] }}</div>
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 15%;">Gudang</th>
                <th style="width: 12%;">Kode Produk</th>
                <th style="width: 20%;">Nama Produk</th>
                <th style="width: 8%;">Satuan</th>
                <th class="text-right" style="width: 8%;">Qty</th>
                <th class="text-right" style="width: 8%;">Reserved</th>
                <th class="text-right" style="width: 8%;">Available</th>
                <th class="text-right" style="width: 8%;">Min Stock</th>
                <th class="text-right" style="width: 10%;">Harga</th>
                <th class="text-right" style="width: 10%;">Nilai</th>
                <th style="width: 8%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @if(is_array($stockReport['data']))
                @foreach($stockReport['data'] as $item)
                <tr>
                    <td>{{ $item['warehouse_name'] }}</td>
                    <td>{{ $item['product_code'] }}</td>
                    <td>{{ $item['product_name'] }}</td>
                    <td>{{ $item['unit'] }}</td>
                    <td class="text-right">{{ number_format($item['quantity'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($item['reserved_qty'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($item['available_qty'], 0, ',', '.') }}</td>
                    <td class="text-right">{{ number_format($item['min_stock'], 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($item['cost'], 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($item['value'], 0, ',', '.') }}</td>
                    <td class="status-{{ $item['status'] }}">{{ ucfirst(str_replace('_', ' ', $item['status'])) }}</td>
                </tr>
                @endforeach
            @else
                @foreach($stockReport['data'] as $warehouse => $items)
                    <tr class="warehouse-group">
                        <td colspan="11">{{ $warehouse }}</td>
                    </tr>
                    @foreach($items as $item)
                    <tr>
                        <td>{{ $item['warehouse_name'] }}</td>
                        <td>{{ $item['product_code'] }}</td>
                        <td>{{ $item['product_name'] }}</td>
                        <td>{{ $item['unit'] }}</td>
                        <td class="text-right">{{ number_format($item['quantity'], 0, ',', '.') }}</td>
                        <td class="text-right">{{ number_format($item['reserved_qty'], 0, ',', '.') }}</td>
                        <td class="text-right">{{ number_format($item['available_qty'], 0, ',', '.') }}</td>
                        <td class="text-right">{{ number_format($item['min_stock'], 0, ',', '.') }}</td>
                        <td class="text-right">Rp {{ number_format($item['cost'], 0, ',', '.') }}</td>
                        <td class="text-right">Rp {{ number_format($item['value'], 0, ',', '.') }}</td>
                        <td class="status-{{ $item['status'] }}">{{ ucfirst(str_replace('_', ' ', $item['status'])) }}</td>
                    </tr>
                    @endforeach
                @endforeach
            @endif
        </tbody>
    </table>

    <div class="footer">
        <div>Dicetak pada: {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }}</div>
        <div>Sistem GudangKu - Laporan Stok Barang</div>
    </div>
</body>
</html>
