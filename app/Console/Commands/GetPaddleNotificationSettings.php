<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Paddle\Cashier;

class GetPaddleNotificationSettings extends Command
{
    protected $signature = 'paddle:notifications';

    protected $description = 'Get Paddle notification settings';

    public function handle(): int
    {
        try {
            $response = Cashier::api('GET', '/notification-settings');
            $this->info('Notification Settings:');
            $this->line(json_encode($response->json(), JSON_PRETTY_PRINT));

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}
