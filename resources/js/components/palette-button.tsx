import { Palette } from 'lucide-react';
import { forwardRef } from 'react';

interface PaletteButtonProps {
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

const PaletteButton = forwardRef<HTMLButtonElement, PaletteButtonProps>(
    ({ className, onClick, children }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                className={className}
                onClick={onClick}
                aria-label="Open theme picker"
            >
                {children || <Palette className="size-4" />}
            </button>
        );
    }
);

PaletteButton.displayName = 'PaletteButton';

export default PaletteButton;