import { Head } from '@inertiajs/react';


export default function Home() {
    return (
            <>
            <Head title="Home" />
            <div className="flex flex-col items-center justify-center px-6 py-20 lg:px-8">
                <div className="text-center">
                    <h1 className="text-4xl font-medium tracking-tight lg:text-6xl">
                        Welcome to UI.DesignByCode
                    </h1>
                    <p className="mt-6 text-lg text-[#706f6c] dark:text-[#A1A09A]">
                        Build beautiful user interfaces with Laravel and React.
                    </p>
                </div>
            </div>
            </>
    );
}

Home.displayName = 'Home';
