import Wrapper from '@/components/wrapper';
import { cn } from '@/lib/utils';

const MainFooter = ({ className }: { className?: string }) => {
    return (
        <footer className={cn('mt-12 border-t border-border py-8', className)}>
            <Wrapper>
                <p>Copyright © 2026</p>
            </Wrapper>
        </footer>
    );
};

MainFooter.displayName = 'MainFooter';

export default MainFooter;
