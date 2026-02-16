<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Peringatan Stok Rendah</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .header p {
            margin: 10px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .alert {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
        }
        .alert h2 {
            margin: 0 0 10px 0;
            color: #856404;
            font-size: 18px;
        }
        .stock-item {
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            border-left: 4px solid #ff6b6b;
        }
        .stock-item h3 {
            margin: 0 0 5px 0;
            font-size: 16px;
            color: #2d3748;
        }
        .stock-item p {
            margin: 5px 0;
            font-size: 14px;
            color: #718096;
        }
        .quantity {
            font-weight: bold;
            color: #ff6b6b;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            color: #718096;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 Peringatan Stok Rendah</h1>
            <p>{{ $scope === 'warehouse' ? 'Gudang ' . $stocks->first()->warehouse->name : 'Semua Gudang' }}</p>
        </div>

        <div class="content">
            <div class="alert">
                <h2>Perhatian!</h2>
                <p>Beberapa item memiliki stok rendah dan perlu segera diisi ulang untuk menghindari kekurangan stok.</p>
            </div>

            @foreach($stocks as $stock)
            <div class="stock-item">
                <h3>{{ $stock->product->name }}</h3>
                <p><strong>Kode:</strong> {{ $stock->product->code }}</p>
                <p><strong>Gudang:</strong> {{ $stock->warehouse->name }}</p>
                <p><strong>Stok Tersedia:</strong> <span class="quantity">{{ $stock->available_qty }}</span></p>
                <p><strong>Total Stok:</strong> <span class="quantity">{{ $stock->quantity }}</span></p>
            </div>
            @endforeach
        </div>

        <div class="footer">
            <p>Email ini dikirim otomatis oleh sistem GudangKu</p>
            <p>Silakan segera lakukan pengisian ulang stok untuk menjaga kelancaran operasional</p>
        </div>
    </div>
</body>
</html>
