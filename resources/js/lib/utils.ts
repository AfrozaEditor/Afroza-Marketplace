import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDateShort(date: string | Date): string {
    const formattedDate = format(new Date(date), 'MMMM yyyy', { locale: fr });
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

export function formatDate(date: string | Date): string {
    return format(new Date(date), 'dd MMMM yyyy', { locale: fr });
}
