import { Button } from '@/components/ui/button';
import { provider } from '@/routes/auth';

export default function SocialLogin() {
    return (
        <div className="grid grid-cols-2 gap-2">
            <Button asChild variant="outline" type="button">
                <a
                    href={provider.url({
                        provider: 'github',
                    })}
                >
                    Login with Github
                </a>
            </Button>
            <Button asChild variant="outline" type="button">
                <a
                    href={provider.url({
                        provider: 'google',
                    })}
                >
                    Login with Google
                </a>
            </Button>
        </div>
    );
}
