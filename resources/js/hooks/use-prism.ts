'use client';

import Prism from 'prismjs';
import { useCallback, useMemo } from 'react';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';

const languageMap: Record<string, string> = {
    js: 'javascript',
    ts: 'typescript',
    css: 'css',
    php: 'php',
    markup: 'markup',
    sh: 'bash',
    shell: 'bash',
    html: 'markup',
};

export function usePrismHighlight(code: string, language: string = 'bash') {
    const normalizedLanguage = useMemo(
        () => languageMap[language.toLowerCase()] || language.toLowerCase(),
        [language],
    );

    const grammar = useMemo(
        () => Prism.languages[normalizedLanguage],
        [normalizedLanguage],
    );

    const highlightedCode = useMemo(
        () =>
            grammar ? Prism.highlight(code, grammar, normalizedLanguage) : code,
        [code, grammar, normalizedLanguage],
    );

    return {
        normalizedLanguage,
        highlightedCode,
    };
}

export function useCopyToClipboard() {
    const copy = useCallback(async (text: string): Promise<boolean> => {
        try {
            await navigator.clipboard.writeText(text);

            return true;
        } catch {
            return false;
        }
    }, []);

    return { copy };
}
