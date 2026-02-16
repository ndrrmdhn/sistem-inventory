<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('stock:check-expired-batches')
    ->daily()
    ->withoutOverlapping()
    ->runInBackground()
    ->onOneServer();

Schedule::command('send:stock-report mingguan --role=super-admin --channel=email')
    ->weeklyOn(1, '08:00') // Every Monday at 08:00
    ->withoutOverlapping()
    ->runInBackground()
    ->onOneServer();

Schedule::command('check:low-stock --channel=email')
    ->dailyAt('09:00') // Every day at 09:00
    ->withoutOverlapping()
    ->runInBackground()
    ->onOneServer();
