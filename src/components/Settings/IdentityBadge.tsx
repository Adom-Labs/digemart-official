import { Mail, Chrome, Wallet } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface IdentityBadgeProps {
    provider: 'EMAIL' | 'GOOGLE' | 'WALLET';
    isPrimary?: boolean;
}

export function IdentityBadge({ provider, isPrimary }: IdentityBadgeProps) {
    const icons = {
        EMAIL: Mail,
        GOOGLE: Chrome,
        WALLET: Wallet,
    };

    const Icon = icons[provider];

    return (
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1">
                <Icon className="h-3 w-3" />
                {provider}
            </Badge>
            {isPrimary && (
                <Badge variant="default" className="text-xs">
                    Primary
                </Badge>
            )}
        </div>
    );
}
