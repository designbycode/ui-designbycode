"use client";

import { useEffect, useRef, useState } from 'react';
import { Copy, Search, Terminal } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { usePackageManagerStore } from '@/store/use-package-manager';
import { AnimatedTabs } from '@/registry/new-york/components/ui/tabs/animated-tabs';
import { useCopyToClipboard, usePrismHighlight } from '@/hooks/use-prism';
import type { RegistryProps } from '@/types';

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface PackageManagerCode {
    npm?: string;
    pnpm?: string;
    yarn?: string;
    bun?: string;
}


interface PackageManagerSearchProps {
    codes?: PackageManagerCode;
    defaultManager?: PackageManager;
    className?: string;
    defaultRegistry?: string;
}

const managers: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

const BASE_URL = "https://ui.designbycode.co.za";

function extractRegistryName(codes: PackageManagerCode | undefined): string {
    if (!codes) return "glow-conic";
    const code = codes.npm ?? codes.pnpm ?? codes.yarn ?? codes.bun ?? "";
    const match = code.match(/\/r\/([^.]+)\.json/);
    return match ? match[1] : "glow-conic";
}

function buildCodes(registryName: string): PackageManagerCode {
    const url = `${BASE_URL}/r/${registryName}.json`;
    return {
        npm: `npm shadcn@latest add ${url}`,
        yarn: `yarn shadcn@latest add ${url}`,
        pnpm: `pnpm shadcn@latest add ${url}`,
        bun: `bunx --bun shadcn@latest add ${url}`,
    };
}

export function PackageManagerSearch({
    codes: initialCodes,
    className,
    defaultRegistry,
}: PackageManagerSearchProps) {
    const { selectedManager, setSelectedManager, selectedRegistry, setSelectedRegistry } = usePackageManagerStore();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [results, setResults] = useState<RegistryProps[]>([]);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const initialName = defaultRegistry ?? extractRegistryName(initialCodes);
    const registryName = selectedRegistry || initialName;

    useEffect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            setResults([]);
            return;
        }
        setLoading(true);
        const params = new URLSearchParams({ q: searchQuery });
        fetch(`/api/registries/search?${params}`)
            .then((res) => res.json())
            .then((data) => {
                setResults(data);
            })
            .catch(() => {
                setResults([]);
            })
            .finally(() => setLoading(false));
    }, [searchQuery]);

    useEffect(() => {
        if (searchOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [searchOpen]);

    const available = managers.filter((m) => {

        return buildCodes(registryName)[m];
    });

    const currentCodes = buildCodes(registryName);
    const code = currentCodes[selectedManager] ?? "";
    const { normalizedLanguage, highlightedCode } = usePrismHighlight(code, "bash");
    const { copy } = useCopyToClipboard();

    const handleCopy = async () => {
        await copy(code);
        toast.success(`${selectedManager} command copied to clipboard!`);
    };

    const handleSelectRegistry = (item: RegistryProps) => {
        setSelectedRegistry(item.name);
        setSearchOpen(false);
        toast.success(`Selected: ${item.name}`);
    };

    return (
        <div
            className={cn(
                "group/package-manager relative rounded-lg min-w-0 border ",
                className
            )}
        >
            <div className="flex items-center rounded-t-[inherit] justify-between border-b bg-muted/50 px-3 py-2">
                <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 text-muted-foreground" />

                    <AnimatedTabs
                        value={selectedManager}
                        onChange={(id) => setSelectedManager(id as PackageManager)}
                        tabs={available.map((m) => ({
                            id: m,
                            label: m,
                        }))}
                        tabsClassName="p-1"
                        tabClassName="px-2 py-1 text-xs font-medium "
                    />
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchOpen(true)}
                        className="transition-opacity hover:opacity-100"
                    >
                        <Search className="size-3" />
                        <span className="sr-only">Search registry</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopy}
                        className="transition-opacity  hover:opacity-100"
                    >
                        <Copy className="size-3" />
                        <span className="sr-only">Copy</span>
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto p-3 max-w-full min-w-0">
                <pre className="w-full min-w-0 m-0! overflow-clip rounded-b-[inherit] rounded-none! font-mono! text-sm leading-relaxed">
                    <code className="pr-6" data-language="bash" suppressHydrationWarning>
                        <span dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                    </code>
                </pre>
            </div>

            <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
                <DialogContent className="overflow-hidden p-0 max-w-md">
                    <DialogTitle className="sr-only">Search Registry</DialogTitle>
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search registry..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
                        />
                    </div>
                    <div className="max-h-75 overflow-y-auto p-2">
                        {loading ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Searching...
                            </div>
                        ) : results.length === 0 && searchQuery.length >= 2 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                No results found.
                            </div>
                        ) : results.length === 0 ? (
                            <div className="py-6 text-center text-sm text-muted-foreground">
                                Type to search registries...
                            </div>
                        ) : (
                            results.map((item: RegistryProps) => (
                                <button
                                    key={item.name}
                                    type="button"
                                    className="w-full text-left px-2 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground cursor-pointer"
                                    onClick={() => handleSelectRegistry(item)}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{item.title} </span>
                                        {item.type && (
                                            <span className="text-xs text-muted-foreground">
                                                {item.type}
                                            </span>
                                        )}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
