'use client';

import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ArrowRightIcon } from 'lucide-react';

export function WelcomeSection() {
    const { data: session } = useSession();
    console.log(session);

    const userName = session?.user?.name || 'User';
    const userIntent = 'mixed'; // TODO: get from user profile

    const getGradientClass = () => {
        switch (userIntent) {
            case 'business-listings':
                return 'bg-gradient-to-r from-green-500 to-green-600';
            case 'ecommerce':
                return 'bg-gradient-to-r from-orange-500 to-orange-600';
            case 'mixed':
                return 'bg-gradient-to-r from-indigo-500 to-indigo-600';
            default:
                return 'bg-gradient-to-r from-purple-500 to-purple-600';
        }
    };

    const getMessage = () => {
        switch (userIntent) {
            case 'business-listings':
                return 'Grow your business presence across the web';
            case 'ecommerce':
                return 'Scale your online store with powerful tools';
            case 'mixed':
                return 'Managing your stores effortlessly';
            default:
                return 'Welcome to your dashboard';
        }
    };

    return (
        <section
            className={`${getGradientClass()} rounded-lg p-8 md:p-12 mb-8 text-white`}
        >
            <div className="max-w-3xl">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                    Welcome back, {userName}
                </h1>
                <p className="text-lg md:text-xl opacity-90 mb-6">{getMessage()}</p>
                <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 font-normal"
                >
                    Go to Overview
                    <ArrowRightIcon className="ml-2" size={20} strokeWidth={2} />
                </Button>
            </div>
        </section>
    );
}