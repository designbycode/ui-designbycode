'use client';

import { motion } from 'framer-motion';
import type { HTMLAttributes, ReactNode } from 'react';
import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

export type AnimatedTabsProps = Omit<
    HTMLAttributes<HTMLDivElement>,
    'onChange'
> & {
    tabs: {
        id: string;
        label: ReactNode;
        content?: ReactNode;
    }[];
    value?: string;
    defaultValue?: string;
    onChange?: (tabId: string) => void;
    tabsClassName?: string;
    tabClassName?: string;
    activeTabClassName?: string;
    inactiveTabClassName?: string;
    indicatorClassName?: string;
    contentClassName?: string;
    showContent?: boolean;
};

export function AnimatedTabs({
    tabs,
    value,
    defaultValue,
    onChange,
    className,
    tabsClassName,
    tabClassName,
    activeTabClassName,
    inactiveTabClassName,
    indicatorClassName,
    contentClassName,
    showContent = false,
    ...props
}: AnimatedTabsProps) {
    const id = useId();

    const resolveIndex = (tabId?: string) => {
        if (!tabId) {
            return 0;
        }

        const idx = tabs.findIndex((t) => t.id === tabId);

        return idx >= 0 ? idx : 0;
    };

    const [activeIndex, setActiveIndex] = useState(() =>
        resolveIndex(defaultValue),
    );

    const isControlled = value !== undefined;
    const activeTabIndex = isControlled ? resolveIndex(value) : activeIndex;
    const activeTab = tabs[activeTabIndex] ?? tabs[0];

    const handleChange = (index: number) => {
        if (!isControlled) {
            setActiveIndex(index);
        }

        onChange?.(tabs[index].id);
    };

    return (
        <div className={cn('w-full', className)} {...props}>
            <div
                role="tablist"
                className={cn(
                    'flex items-center gap-1 rounded-md border border-border bg-background p-1',
                    tabsClassName,
                )}
            >
                {tabs.map((tab, index) => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTabIndex === index}
                        aria-controls={`${id}-panel-${tab.id}`}
                        id={`${id}-tab-${tab.id}`}
                        onClick={() => handleChange(index)}
                        className={cn(
                            'relative rounded-sm px-4 py-2 text-xs font-medium transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:outline-none',
                            tabClassName,
                            activeTabIndex === index
                                ? cn('text-foreground', activeTabClassName)
                                : cn(
                                      'text-muted-foreground hover:text-foreground',
                                      inactiveTabClassName,
                                  ),
                        )}
                    >
                        {activeTabIndex === index && (
                            <motion.div
                                layoutId={`${id}-indicator`}
                                className={cn(
                                    'absolute inset-0 rounded-sm bg-muted',
                                    indicatorClassName,
                                )}
                                transition={{
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            />
                        )}
                        <span className="relative z-10">{tab.label}</span>
                    </button>
                ))}
            </div>

            {showContent && activeTab?.content && (
                <div
                    role="tabpanel"
                    id={`${id}-panel-${activeTab.id}`}
                    aria-labelledby={`${id}-tab-${activeTab.id}`}
                    className={cn('mt-4', contentClassName)}
                >
                    <motion.div
                        key={activeTab.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.2 }}
                    >
                        {activeTab.content}
                    </motion.div>
                </div>
            )}
        </div>
    );
}
