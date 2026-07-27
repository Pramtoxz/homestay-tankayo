import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            if (data.action) {
                toast[data.type](data.message, {
                    action: {
                        label: data.action.label,
                        onClick: () => window.open(data.action!.url, '_blank'),
                    },
                    duration: 10000,
                });
            } else {
                toast[data.type](data.message);
            }
        });
    }, []);
}
