import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AnimatedTabs } from '@/registry/new-york/components/ui/tabs/animated-tabs';
import { Check } from 'lucide-react';
import TextAnimator from '@/registry/new-york/components/ui/animations/text-animator';
import { GlowRadial } from '@/registry/new-york/components/ui/glow/glow-radial';

const tiers = [
    {
        name: "Free",
        id: "free",
        monthlyPrice: "$0",
        yearlyPrice: "$0",
        description: "Essential components for hobby projects",
        features: [
            "10 free components",
            "Basic usage examples",
            "Community support",
            "MIT license",
        ],
        cta: "Get Started",
        mostPopular: false,
    },
    {
        name: "Premium",
        id: "premium",
        monthlyPrice: "$5",
        yearlyPrice: "$50",
        description: "Full access to all components and future releases",
        features: [
            "Unlimited components",
            "Advanced components",
            "Priority email support",
            "Commercial license",
            "Early access to new components",
            "Figma source files",
        ],
        cta: "Subscribe Now",
        mostPopular: true,
    },
] as const

function PricingTable({ className, ...props }: React.ComponentProps<"div">) {
    const [billingCycle, setBillingCycle] = React.useState("monthly")

    return (
        <div
            data-slot="pricing-table"
            className={cn("flex flex-col gap-6", className)}
            {...props}
        >
            <AnimatedTabs
                value={billingCycle}
                className="mx-auto max-w-md isolate relative"
                onChange={setBillingCycle}
                tabs={[
                    {
                        id: "monthly",
                        label: "Monthly",
                        content: null,
                    },
                    {
                        id: "yearly",
                        label: "Yearly",
                        content: null,
                    },
                ]}
                tabsClassName=" border border-border items-center gap-1 rounded-md p-1"
                tabClassName="flex-1"
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mx-auto max-w-3xl">
                {tiers.map((tier) => (
                    <Card
                        key={tier.id}
                        className={cn(
                            "flex flex-col relative isolate rounded-default",
                            // tier.mostPopular && "border-primary shadow-md"
                        )}
                    >
                        <GlowRadial className={`-inset-1`} />
                        <CardHeader>
                            <CardTitle>{tier.name}</CardTitle>
                            <CardDescription>
                                {tier.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex items-baseline gap-1">
                                <TextAnimator animation={`elastic`} className="text-4xl font-bold">
                                    {billingCycle === "monthly"
                                        ? tier.monthlyPrice
                                        : tier.yearlyPrice}
                                </TextAnimator>
                                <span className="text-muted-foreground">
                                        /{billingCycle === "monthly" ? `Month` : `Year`}
                                </span>
                            </div>
                            <ul className="mt-6 space-y-3">
                                {tier.features.map((feature, index) => (
                                    <li key={index} className="flex gap-2">
                                        <Check className="size-5 text-primary shrink-0" />
                                        <span className="text-sm">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                variant={
                                    tier.mostPopular ? "default" : "outline"
                                }
                            >
                                {tier.cta}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export { PricingTable, tiers }
