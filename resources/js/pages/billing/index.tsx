import { Form, Head, Link } from '@inertiajs/react';
import { CreditCard, Download, Pause, Play, X } from 'lucide-react';
import { useEffect } from 'react';
import BillingController from '@/actions/App/Http/Controllers/Billing/BillingController';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

type SubscriptionStatus =
    | 'active'
    | 'paused'
    | 'canceled'
    | 'past_due'
    | 'trialing';

interface Subscription {
    id: string;
    status: SubscriptionStatus;
    type: string;
    trial_ends_at: string | null;
    paused_at: string | null;
    ends_at: string | null;
    currentPeriodEndsAt: string | null;
    price_id: string | null;
}

interface Invoice {
    id: number;
    number: string;
    amount: string;
    tax: string;
    currency: string;
    status: string;
    billed_at: string;
    url: string;
}

interface UpcomingInvoice {
    amount: string;
    tax: string;
    currency: string;
    due: string;
}

interface Customer {
    paddle_id: string | null;
    name: string;
    email: string;
}

interface Plans {
    monthly: { price_id: string };
    yearly: { price_id: string };
}

interface BillingProps {
    subscription: Subscription | null;
    invoices: Invoice[];
    upcomingInvoice: UpcomingInvoice | null;
    customer: Customer;
    plans: Plans;
    checkout?: Record<string, unknown>;
}

function formatCurrency(amount: string, currency: string = 'USD'): string {
    const numAmount = parseFloat(amount);

    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
    }).format(numAmount);
}

function formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
        return 'N/A';
    }

    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function getPlanName(priceId: string | null, plans: Plans): string {
    if (!priceId) {
        return 'No active plan';
    }

    if (priceId === plans.yearly.price_id) {
        return 'Yearly';
    }

    if (priceId === plans.monthly.price_id) {
        return 'Monthly';
    }

    return 'Unknown';
}

function getStatusBadgeColor(status: SubscriptionStatus): string {
    switch (status) {
        case 'active':
            return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'paused':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'canceled':
            return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        case 'past_due':
            return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
        case 'trialing':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
}

export default function Billing({
    subscription,
    invoices,
    upcomingInvoice,
    customer,
    plans,
    checkout,
}: BillingProps) {
    const currentPlanName = subscription?.price_id
        ? getPlanName(subscription.price_id, plans)
        : null;
    const isPaused = subscription?.status === 'paused';
    const isCanceled = subscription?.ends_at !== null;

    useEffect(() => {
        if (
            checkout &&
            typeof window !== 'undefined' &&
            (
                window as {
                    Paddle?: {
                        Initialize: (options: unknown) => void;
                        Checkout: {
                            open: (options: { token: string }) => void;
                        };
                    };
                }
            ).Paddle
        ) {
            const Paddle = (
                window as {
                    Paddle?: {
                        Initialize: (options: unknown) => void;
                        Checkout: {
                            open: (options: { token: string }) => void;
                        };
                    };
                }
            ).Paddle!;
            Paddle.Initialize({
                token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
            });
            Paddle.Checkout.open({
                token: (checkout.settings as { token?: string })?.token || '',
            });
        }
    }, [checkout]);

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Head title="Billing" />

            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Billing
                    </h2>
                    <p className="text-muted-foreground">
                        Manage your subscription, invoices, and payment method.
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="size-5" />
                                Subscription
                            </CardTitle>
                            <CardDescription>
                                Your current subscription details
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {subscription ? (
                                <>
                                    <div className="flex flex-wrap items-center justify-between gap-4">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                Status
                                            </p>
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(subscription.status)}`}
                                            >
                                                {subscription.status.replace(
                                                    '_',
                                                    ' ',
                                                )}
                                            </span>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                Plan
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {currentPlanName ||
                                                    'No active plan'}
                                            </p>
                                        </div>

                                        <div className="space-y-1">
                                            <p className="text-sm font-medium">
                                                {subscription.status ===
                                                'paused'
                                                    ? 'Paused At'
                                                    : subscription.ends_at
                                                      ? 'Ends At'
                                                      : 'Next Billing'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {subscription.status ===
                                                'paused'
                                                    ? formatDate(
                                                          subscription.paused_at,
                                                      )
                                                    : subscription.ends_at
                                                      ? formatDate(
                                                            subscription.ends_at,
                                                        )
                                                      : formatDate(
                                                            subscription.currentPeriodEndsAt,
                                                        )}
                                            </p>
                                        </div>
                                    </div>

                                    {subscription.trial_ends_at && (
                                        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
                                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                                Trial ends{' '}
                                                {formatDate(
                                                    subscription.trial_ends_at,
                                                )}
                                            </p>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        You don't have an active subscription.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <Form
                                            action={BillingController.subscribe.get()}
                                            method="get"
                                        >
                                            <input
                                                type="hidden"
                                                name="plan"
                                                value="monthly"
                                            />
                                            <Button type="submit">
                                                Subscribe Monthly
                                            </Button>
                                        </Form>

                                        <Form
                                            action={BillingController.subscribe.get()}
                                            method="get"
                                        >
                                            <input
                                                type="hidden"
                                                name="plan"
                                                value="yearly"
                                            />
                                            <Button
                                                type="submit"
                                                variant="outline"
                                            >
                                                Subscribe Yearly
                                            </Button>
                                        </Form>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {subscription && (
                        <>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Switch Plan</CardTitle>
                                    <CardDescription>
                                        Change your subscription billing cycle
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4">
                                        <Form
                                            action={BillingController.switchPlan.post()}
                                            method="post"
                                        >
                                            <input
                                                type="hidden"
                                                name="plan"
                                                value="monthly"
                                            />
                                            <Button
                                                type="submit"
                                                variant={
                                                    subscription.price_id ===
                                                    plans.monthly.price_id
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                disabled={
                                                    subscription.price_id ===
                                                        plans.monthly
                                                            .price_id ||
                                                    isCanceled
                                                }
                                            >
                                                Monthly
                                            </Button>
                                        </Form>

                                        <Form
                                            action={BillingController.switchPlan.post()}
                                            method="post"
                                        >
                                            <input
                                                type="hidden"
                                                name="plan"
                                                value="yearly"
                                            />
                                            <Button
                                                type="submit"
                                                variant={
                                                    subscription.price_id ===
                                                    plans.yearly.price_id
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                disabled={
                                                    subscription.price_id ===
                                                        plans.yearly.price_id ||
                                                    isCanceled
                                                }
                                            >
                                                Yearly
                                            </Button>
                                        </Form>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Subscription Actions</CardTitle>
                                    <CardDescription>
                                        Manage your subscription status
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-4">
                                        {isPaused ? (
                                            <Form
                                                action={BillingController.resume.post()}
                                                method="post"
                                            >
                                                <Button
                                                    type="submit"
                                                    variant="default"
                                                >
                                                    <Play className="mr-2 size-4" />
                                                    Resume Subscription
                                                </Button>
                                            </Form>
                                        ) : (
                                            !isCanceled && (
                                                <Form
                                                    action={BillingController.pause.post()}
                                                    method="post"
                                                >
                                                    <Button
                                                        type="submit"
                                                        variant="outline"
                                                    >
                                                        <Pause className="mr-2 size-4" />
                                                        Pause Subscription
                                                    </Button>
                                                </Form>
                                            )
                                        )}

                                        {!isCanceled && (
                                            <Form
                                                action={BillingController.cancel.post()}
                                                method="post"
                                            >
                                                <Button
                                                    type="submit"
                                                    variant="destructive"
                                                >
                                                    <X className="mr-2 size-4" />
                                                    Cancel Subscription
                                                </Button>
                                            </Form>
                                        )}
                                    </div>

                                    {isCanceled && subscription.ends_at && (
                                        <div className="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-950">
                                            <p className="text-sm font-medium text-red-900 dark:text-red-100">
                                                Your subscription will be
                                                canceled on{' '}
                                                {formatDate(
                                                    subscription.ends_at,
                                                )}
                                                . You can resume it before that
                                                date.
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Method</CardTitle>
                            <CardDescription>
                                Your current payment information
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-lg border p-4">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="size-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">
                                                {customer.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {customer.email}
                                            </p>
                                        </div>
                                    </div>

                                    {subscription && (
                                        <Form
                                            action={BillingController.updatePaymentMethod.post()}
                                            method="post"
                                        >
                                            <Button
                                                type="submit"
                                                variant="outline"
                                                size="sm"
                                            >
                                                Update Payment Method
                                            </Button>
                                        </Form>
                                    )}
                                </div>

                                {upcomingInvoice && (
                                    <div className="rounded-lg bg-muted p-4">
                                        <p className="text-sm font-medium">
                                            Upcoming Invoice
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {formatCurrency(
                                                upcomingInvoice.amount,
                                                upcomingInvoice.currency,
                                            )}{' '}
                                            due{' '}
                                            {formatDate(upcomingInvoice.due)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Invoices</CardTitle>
                            <CardDescription>
                                Your billing history and invoices
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {invoices.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Invoice</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                Download
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {invoices.map((invoice) => (
                                            <TableRow key={invoice.id}>
                                                <TableCell className="font-medium">
                                                    {invoice.number}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(
                                                        invoice.billed_at,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {formatCurrency(
                                                        invoice.amount,
                                                        invoice.currency,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                            invoice.status ===
                                                            'completed'
                                                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                        }`}
                                                    >
                                                        {invoice.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="sm"
                                                    >
                                                        <Link
                                                            href={invoice.url}
                                                            target="_blank"
                                                        >
                                                            <Download className="size-4" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <p className="py-8 text-center text-sm text-muted-foreground">
                                    No invoices yet.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

Billing.layout = [
    AppLayout,
    {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
            {
                title: 'Billing',
                href: '#',
            },
        ],
    },
];
