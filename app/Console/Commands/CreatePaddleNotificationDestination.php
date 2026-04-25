<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Laravel\Paddle\Cashier;

class CreatePaddleNotificationDestination extends Command
{
    protected $signature = 'paddle:create-notification {url}';

    protected $description = 'Create a Paddle notification destination for webhooks';

    public function handle(): int
    {
        $url = $this->argument('url');

        if (! filter_var($url, FILTER_VALIDATE_URL)) {
            $this->error('Invalid URL provided');

            return self::FAILURE;
        }

        $payload = [
            'description' => 'Laravel Webhook Handler',
            'type' => 'url',
            'destination' => $url,
            'subscribed_events' => [
                'customer.created',
                'customer.updated',
                'subscription.created',
                'subscription.updated',
                'subscription.paused',
                'subscription.canceled',
                'subscription.resumed',
                'transaction.completed',
                'transaction.updated',
            ],
            'api_version' => 1,
            'active' => true,
            'traffic_source' => 'all',
        ];

        try {
            $this->info('Creating notification destination...');
            $this->line('URL: '.$url);

            $response = Cashier::api('POST', '/notification-settings', $payload);

            $this->info('Notification destination created successfully!');
            $this->line(json_encode($response->json(), JSON_PRETTY_PRINT));

            return self::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error creating notification: '.$e->getMessage());

            return self::FAILURE;
        }
    }
}
