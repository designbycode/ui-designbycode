'use client';

import { motion } from 'framer-motion';
import type { HTMLAttributes, ReactNode } from 'react';
import { useId, useState } from 'react';

import { cn } from '@/lib/utils';

export type AnimatedTabsProps = HTMLAttributes<HTMLDivElement> & {
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
    showContent = true,
    ...props
}: AnimatedTabsProps) {
    const id = useId();
    const defaultIndex = defaultValue
        ? tabs.findIndex((t) => t.id === defaultValue)
        : 0;
    const [activeIndex, setActiveIndex] = useState(
        defaultIndex >= 0 ? defaultIndex : 0,
    );

    const isControlled = value !== undefined;
    const activeTabIndex = isControlled
        ? Math.max(
              0,
              tabs.findIndex((t) => t.id === value),
          )
        : activeIndex;
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
                className={cn(
                    'relative flex items-center gap-1',
                    tabsClassName,
                )}
            >
                {tabs.map((tab, index) => (
                    <motion.button
                        key={tab.id}
                        onClick={() => handleChange(index)}
                        className={cn(
                            'relative z-10 flex-1 rounded-sm px-2 py-1 text-xs font-medium transition-colors',
                            tabClassName,
                            activeTabIndex === index
                                ? activeTabClassName
                                : inactiveTabClassName,
                        )}
                    >
                        <span className="relative z-10">{tab.label}</span>
                        {activeTabIndex === index && (
                            <motion.div
                                layoutId={`${id}-indicator`}
                                className={cn(
                                    'absolute inset-0 rounded-sm',
                                    indicatorClassName,
                                )}
                                transition={{
                                    type: 'spring',
                                    stiffness: 500,
                                    damping: 30,
                                }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
            {showContent && activeTab.content && (
                <div className={cn('mt-4', contentClassName)}>
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
