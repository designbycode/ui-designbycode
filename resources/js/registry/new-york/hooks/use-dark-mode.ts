import { useSyncExternalStore } from 'react';

function getSnapshot(): boolean {
    return document.documentElement.classList.contains('dark');
}

function subscribe(callback: () => void): () => void {
    const observer = new MutationObserver(callback);

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
    });

    return () => {
        observer.disconnect();
    };
}

function useDarkMode(): boolean {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export default useDarkMode;
