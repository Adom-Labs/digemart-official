import { CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VerificationBadgeProps {
    isVerified: boolean;
    type?: 'email' | 'phone';
}

export function VerificationBadge({ isVerified }: VerificationBadgeProps) {
    if (isVerified) {
        return (
            <Badge variant="default" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Verified
            </Badge>
        );
    }

    return (
        <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Unverified
        </Badge>
    );
}
