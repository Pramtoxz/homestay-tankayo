import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatTanggal(date: string | null | undefined): string {
    if (!date) {
        return '-';
    }

    const [year, month, day] = date.split('T')[0].split('-').map(Number);

    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).format(
        new Date(year, month - 1, day),
    );
}

export function formatWaktu(date: string | null | undefined): string {
    if (!date) {
        return '-';
    }

    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta',
    }).format(new Date(date));
}

export function submitFormInNewTab(action: string, fields: Record<string, string>): void {
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = action;
    form.target = '_blank';

    const addField = (name: string, value: string) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    };

    addField('_token', csrfToken);
    Object.entries(fields).forEach(([name, value]) => addField(name, value));

    document.body.appendChild(form);
    form.submit();
    form.remove();
}
