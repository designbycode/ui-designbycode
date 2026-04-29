import React from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface FontSelectProps {
    value: string;
    onChange: (value: string) => void;
    fonts: Array<{ name: string; title: string; description?: string }>;
    placeholder?: string;
}

export function FontSelect({ value, onChange, fonts, placeholder = 'Select font...' }: FontSelectProps) {
    return (
        <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {fonts.map((font) => (
                    <SelectItem key={font.name} value={font.name}>
                        <div>
                            <div className="font-medium">{font.title}</div>
                            {font.description && (
                                <div className="text-xs text-muted-foreground">{font.description}</div>
                            )}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
