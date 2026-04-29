import React, { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { tailwindColors, type TailwindColor } from '@/lib/tailwind-colors';
import { Check, Palette, Pipette } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
    value: string;
    onChange: (value: string) => void;
}

export function TailwindPicker({ value, onChange }: ColorPickerProps) {
    const [open, setOpen] = useState(false);
    const [selectedColor, setSelectedColor] = useState<TailwindColor | null>(null);
    const [selectedShade, setSelectedShade] = useState<string>('500');

    const getCurrentColorDisplay = () => {
        const match = value.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
        if (match) {
            const l = parseFloat(match[1]) * 100;
            return `hsl(${match[3]} 70% ${l}%)`;
        }
        return value || 'transparent';
    };

    const handleTailwindSelect = (color: TailwindColor, shade: string) => {
        const oklchValue = color.shades?.[shade];
        if (oklchValue) {
            onChange(oklchValue);
            setSelectedColor(color);
            setSelectedShade(shade);
            setOpen(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className="w-8 h-8 p-0 border-2 shrink-0"
                    style={{ backgroundColor: getCurrentColorDisplay() }}
                    title="Tailwind Palette"
                >
                    <span className="sr-only">Tailwind Palette</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-3" align="start">
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4" />
                        <span className="text-sm font-medium">Tailwind Colors</span>
                    </div>

                    <ScrollArea className="h-64">
                        <div className="space-y-2 pr-2">
                            {tailwindColors.map((color) => (
                                <div key={color.value}>
                                    <div className="text-xs font-medium text-muted-foreground mb-1">
                                        {color.name}
                                    </div>
                                    <div className="grid grid-cols-11 gap-1">
                                        {color.shades &&
                                            Object.entries(color.shades).map(([shade, oklch]) => (
                                                <button
                                                    key={shade}
                                                    type="button"
                                                    className={cn(
                                                        'w-6 h-6 rounded border-2 transition-all hover:scale-110',
                                                        selectedColor?.value === color.value &&
                                                            selectedShade === shade
                                                            ? 'border-primary ring-2 ring-primary/20'
                                                            : 'border-transparent'
                                                    )}
                                                    style={{
                                                        backgroundColor: (() => {
                                                            const match = oklch.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/);
                                                            if (match) {
                                                                return `hsl(${match[3]} 70% ${parseFloat(match[1]) * 100}%)`;
                                                            }
                                                            return 'transparent';
                                                        })(),
                                                    }}
                                                    onClick={() => handleTailwindSelect(color, shade)}
                                                    title={`${color.name} ${shade}`}
                                                >
                                                    {selectedColor?.value === color.value &&
                                                        selectedShade === shade && (
                                                            <Check className="w-3 h-3 text-white mx-auto" />
                                                        )}
                                                </button>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </PopoverContent>
        </Popover>
    );
}

export function CustomPicker({ value, onChange }: ColorPickerProps) {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState(value);
    const [hexInput, setHexInput] = useState('#000000');

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        onChange(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onChange(inputValue);
        }
    };

    const handleHexChange = (hex: string) => {
        setHexInput(hex);
        onChange(`oklch(0.5 0.1 180)`);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    title="Custom Color Picker"
                >
                    <Pipette className="w-4 h-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-3" align="start">
                <div className="space-y-2">
                    <HexColorPicker
                        color={hexInput}
                        onChange={handleHexChange}
                    />
                    <Input
                        value={hexInput}
                        onChange={(e) => handleHexChange(e.target.value)}
                        className="font-mono text-xs"
                        placeholder="#000000"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
    const [inputValue, setInputValue] = useState(value);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        onChange(inputValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onChange(inputValue);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <TailwindPicker value={value} onChange={onChange} />
            <CustomPicker value={value} onChange={onChange} />
            <Input
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="font-mono text-xs"
                placeholder="oklch(...)"
            />
        </div>
    );
}
