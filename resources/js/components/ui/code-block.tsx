"use client"

import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useCopyToClipboard, usePrismHighlight } from '@/hooks/use-prism';

interface CodeBlockProps {
    code: string
    language?: string
    className?: string
    variant?: 'default' | 'minimal'
    showCopyButton?: boolean
}


function CodeBlock({
                       code,
                       language = "bash",
                       className,
                       variant = 'default',
                       showCopyButton = true
                   }: CodeBlockProps) {
    const [copied, setCopied] = useState(false)
    const { normalizedLanguage, highlightedCode } = usePrismHighlight(code, language)
    const { copy } = useCopyToClipboard()

    const handleCopy = useCallback(async () => {
        const success = await copy(code)
        if (success) {
            setCopied(true)
            toast.success('Copied to clipboard')
            setTimeout(() => setCopied(false), 2000)
        }
    }, [code, copy])

    return (
        <div
            className={cn(
                "group/code-block bg-muted/30 relative overflow-hidden rounded-lg border border-border text-sm",
                className
            )}
        >
            {variant === 'default' && (
                <div className="flex items-center justify-between border-b border-border bg-muted/50 px-3 py-2">
          <span className="font-mono font-semibold text-xs text-muted-foreground">
            {normalizedLanguage}
          </span>
                    {showCopyButton && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCopy}
                            className="transition-opacity hover:opacity-100"
                        >
                            {copied ? (
                                <Check className="size-3 text-green-500" />
                            ) : (
                                <Copy className="size-3" />
                            )}
                            <span className="sr-only">Copy</span>
                        </Button>
                    )}
                </div>
            )}
            {variant === 'minimal' && showCopyButton && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover/code-block:opacity-100"
                >
                    {copied ? (
                        <Check className="size-3 text-green-500" />
                    ) : (
                        <Copy className="size-3" />
                    )}
                    <span className="sr-only">Copy</span>
                </Button>
            )}
            <div className="overflow-x-auto">
        <pre className={cn(
            "m-0! font-mono! text-sm leading-relaxed",
            variant === 'default' ? "rounded-none! p-3!" : "rounded-lg! p-4!"
        )}>
          <code
              className={`language-${normalizedLanguage}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
          />
        </pre>
            </div>
        </div>
    )
}


export { CodeBlock, type CodeBlockProps }
