"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface CommandDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    className?: string;
    onSearch?: (query: string) => void;
    children: React.ReactNode;
}

function CommandDialog({
    open,
    onOpenChange,
    className,
    onSearch,
    children,
}: CommandDialogProps) {
    const [query, setQuery] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setQuery(value);
        if (onSearch) {
            onSearch(value);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={cn("overflow-hidden p-0", className)}>
                <DialogHeader className="sr-only">
                    <DialogTitle>Search Registry</DialogTitle>
                </DialogHeader>
                <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <input
                        type="text"
                        placeholder="Search registry..."
                        value={query}
                        onChange={handleChange}
                        className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        autoFocus
                    />
                </div>
                <div className="max-h-[300px] overflow-y-auto overflow-x-hidden p-2">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}

function CommandItem({
    className,
    onClick,
    onSelect,
    children,
    ...props
}: React.ComponentProps<"div"> & { onClick?: () => void; onSelect?: () => void }) {
    const handleClick = () => {
        if (onClick) onClick();
        if (onSelect) onSelect();
    };

    return (
        <div
            className={cn(
                "relative flex cursor-pointer select-none items-center rounded-md px-2 py-2 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                className
            )}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            {...props}
        >
            {children}
        </div>
    );
}

function CommandGroup({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "overflow-hidden px-2 py-1 text-sm text-muted-foreground",
                className
            )}
            {...props}
        />
    );
}

export { CommandDialog, CommandItem, CommandGroup };