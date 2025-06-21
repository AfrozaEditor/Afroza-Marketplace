import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Category, type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import AppFooter from '@/components/app-footer';
import { usePage } from '@inertiajs/react';

export default function AppHeaderLayout({ children, breadcrumbs }: PropsWithChildren<{ breadcrumbs?: BreadcrumbItem[] }>) {
    const { categories = [] } = usePage().props;
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} categories={categories}/>
            <AppContent>{children}</AppContent>
            <AppFooter/>
        </AppShell>
    );
}
