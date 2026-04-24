import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';

interface SubscribeProps {
    checkout: {
        items: Array<{ price_id: string; quantity: number }>;
        settings?: Record<string, unknown>;
    };
}

declare global {
    interface Window {
        Paddle: {
            Environment: {
                set: (env: string) => void;
            };
            Initialize: (config: { vendor: number }) => void;
            Checkout: {
                open: (options: Record<string, unknown>) => void;
            };
        };
    }
}

export default function Subscribe({ checkout }: SubscribeProps) {
    const handleSubscribe = () => {
        if (window.Paddle) {
            window.Paddle.Checkout.open({
                ...(checkout as Record<string, unknown>),
                settings: {
                    ...(checkout.settings || {}),
                    displayMode: 'overlay',
                },
            });
        }
    };

    return (
        <>
            <Head title="Subscribe" />
            <div className="flex flex-1 items-center justify-center p-4">
                <button
                    onClick={handleSubscribe}
                    className="rounded-lg bg-primary px-8 py-4 text-primary-foreground hover:opacity-90"
                >
                    Subscribe Now
                </button>
            </div>
        </>
    );
}

Subscribe.layout = [
    AppLayout,
    {
        breadcrumbs: [
            {
                title: 'Subscribe',
                href: '#',
            },
        ],
    },
];
