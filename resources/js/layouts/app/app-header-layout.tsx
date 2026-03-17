import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import { Category, type BreadcrumbItem } from '@/types';
import type { PropsWithChildren } from 'react';
import AppFooter from '@/components/app-footer';
import { usePage } from '@inertiajs/react';

interface AppHeaderLayoutProps {
    breadcrumbs?: BreadcrumbItem[];
    hideFooter?: boolean;
    hideHeader?: boolean;
}

export default function AppHeaderLayout({ children, breadcrumbs, hideFooter = false, hideHeader = false }: PropsWithChildren<AppHeaderLayoutProps>) {
    const { categories = [] } = usePage().props;
    return (
        <AppShell>
            {!hideHeader && <AppHeader breadcrumbs={breadcrumbs} categories={categories}/>}
            <AppContent>{children}</AppContent>
            {!hideFooter && <AppFooter/>}
        </AppShell>
    );
}
