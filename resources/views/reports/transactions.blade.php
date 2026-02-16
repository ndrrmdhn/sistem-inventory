<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Transaction Report</title>
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
        .summary-value.positive {
            color: #059669;
        }
        .summary-value.negative {
            color: #dc2626;
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
        .type-inbound {
            color: #059669;
            font-weight: 600;
        }
        .type-outbound {
            color: #dc2626;
            font-weight: 600;
        }
        .type-mutation {
            color: #7c3aed;
            font-weight: 600;
        }
        .status-badge {
            display: inline-block;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 7px;
            font-weight: 600;
            text-transform: uppercase;
        }
        .status-dikirim {
            background: #dbeafe;
            color: #1e40af;
        }
        .status-diterima {
            background: #dcfce7;
            color: #166534;
        }
        .status-selesai {
            background: #dcfce7;
            color: #166534;
        }
        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            font-size: 8px;
            color: #9ca3af;
        }
        .transaction-type-icon {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 4px;
        }
        .inbound-icon {
            background: #059669;
        }
        .outbound-icon {
            background: #dc2626;
        }
        .mutation-icon {
            background: #7c3aed;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="company-name">PT. GudangKu Indonesia</div>
        <div class="report-title">Laporan Transaksi Barang</div>
        <div class="report-info">
            Periode: {{ \Carbon\Carbon::parse($transactionReport['period']['start_date'])->format('d/m/Y') }} - {{ \Carbon\Carbon::parse($transactionReport['period']['end_date'])->format('d/m/Y') }}
        </div>
        <div class="report-info">Tipe: {{ ucfirst($type) }}</div>
        @if($warehouseId)
            <div class="report-info">Gudang: {{ $warehouse ? $warehouse->name : 'Semua Gudang' }}</div>
        @endif
    </div>

    <div class="summary">
        <div class="summary-row">
            <div class="summary-item">
                <div class="summary-label">Total Masuk</div>
                <div class="summary-value positive">{{ number_format($transactionReport['summary']['total_inbound'], 0, ',', '.') }}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Keluar</div>
                <div class="summary-value negative">{{ number_format($transactionReport['summary']['total_outbound'], 0, ',', '.') }}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Total Mutasi</div>
                <div class="summary-value">{{ number_format($transactionReport['summary']['total_mutations'], 0, ',', '.') }}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">Net Movement</div>
                <div class="summary-value {{ $transactionReport['summary']['net_movement'] >= 0 ? 'positive' : 'negative' }}">
                    {{ ($transactionReport['summary']['net_movement'] >= 0 ? '+' : '') . number_format($transactionReport['summary']['net_movement'], 0, ',', '.') }}
                </div>
            </div>
        </div>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 8%;">Tipe</th>
                <th style="width: 10%;">Kode</th>
                <th style="width: 8%;">Tanggal</th>
                <th style="width: 12%;">Gudang</th>
                <th style="width: 15%;">Produk</th>
                <th style="width: 12%;">Supplier/Pelanggan</th>
                <th style="width: 12%;">Dari/Ke Gudang</th>
                <th class="text-right" style="width: 8%;">Qty</th>
                <th class="text-right" style="width: 10%;">Harga Satuan</th>
                <th class="text-right" style="width: 10%;">Total Harga</th>
                <th style="width: 8%;">Status</th>
            </tr>
        </thead>
        <tbody>
            @foreach($transactionReport['data'] as $transaction)
            <tr>
                <td>
                    <span class="transaction-type-icon {{ $transaction['type'] }}-icon"></span>
                    <span class="type-{{ $transaction['type'] }}">{{ ucfirst($transaction['type']) }}</span>
                </td>
                <td>{{ $transaction['code'] }}</td>
                <td>{{ \Carbon\Carbon::parse($transaction['date'])->format('d/m/Y') }}</td>
                <td>{{ $transaction['warehouse'] ?? '-' }}</td>
                <td>{{ $transaction['product'] }}</td>
                <td>{{ $transaction['supplier'] ?? $transaction['customer'] ?? '-' }}</td>
                <td>{{ ($transaction['from_warehouse'] ?? '') . ' → ' . ($transaction['to_warehouse'] ?? '') }}</td>
                <td class="text-right">{{ number_format($transaction['quantity'], 0, ',', '.') }}</td>
                <td class="text-right">{{ $transaction['unit_price'] ? 'Rp ' . number_format($transaction['unit_price'], 0, ',', '.') : '-' }}</td>
                <td class="text-right">{{ $transaction['total_price'] ? 'Rp ' . number_format($transaction['total_price'], 0, ',', '.') : '-' }}</td>
                <td>
                    @if($transaction['status'])
                        <span class="status-badge status-{{ $transaction['status'] }}">
                            {{ ucfirst($transaction['status']) }}
                        </span>
                    @else
                        -
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <div>Dicetak pada: {{ \Carbon\Carbon::now()->format('d/m/Y H:i:s') }}</div>
        <div>Sistem GudangKu - Laporan Transaksi Barang</div>
    </div>
</body>
</html>
