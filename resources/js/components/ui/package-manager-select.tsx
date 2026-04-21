"use client";

import { Copy, Terminal } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { usePackageManagerStore } from '@/store/use-package-manager';
import { AnimatedTabs } from '@/registry/new-york/components/ui/tabs/animated-tabs';
import { useCopyToClipboard, usePrismHighlight } from '@/hooks/use-prism';

export type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

export interface PackageManagerCode {
    npm?: string;
    pnpm?: string;
    yarn?: string;
    bun?: string;
}

interface PackageManagerSelectProps {
    codes: PackageManagerCode;
    defaultManager?: PackageManager;
    className?: string;
}

const managers: PackageManager[] = ["npm", "pnpm", "yarn", "bun"];

export function PackageManagerSelect({
                                         codes,
                                         className,
                                     }: PackageManagerSelectProps) {
    const { selectedManager, setSelectedManager } = usePackageManagerStore();

    const available = managers.filter((m) => codes[m]);

    const code = codes[selectedManager] ?? "";
    const { normalizedLanguage, highlightedCode } = usePrismHighlight(code, 'bash');
    const { copy } = useCopyToClipboard();

    const handleCopy = async () => {
        await copy(code);
        toast.success(`${selectedManager} command copied to clipboard!`);
    };

    return (
        <div
            className={cn(
                "group/package-manager relative rounded-lg min-w-0 border ",
                className
            )}
        >
            <div className="flex items-center justify-between border-b bg-muted/50 px-3 py-2">
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

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="transition-opacity hover:opacity-100"
                >
                    <Copy className="size-3" />
                    <span className="sr-only">Copy</span>
                </Button>
            </div>
            <div className="overflow-x-auto p-3 max-w-full min-w-0">
<pre className="w-full min-w-0 m-0! rounded-none! bg-transparent! font-mono! text-sm leading-relaxed">
<code
    className={`language-${normalizedLanguage} pr-6`}
    dangerouslySetInnerHTML={{ __html: highlightedCode }}
/>
</pre>  </div>


        </div>
    );
}
