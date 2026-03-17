import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-header-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    hideFooter?: boolean;
    hideHeader?: boolean;
}

export default ({ children, breadcrumbs, hideFooter, hideHeader, ...props }: AppLayoutProps) => (
    <AppLayoutTemplate breadcrumbs={breadcrumbs} hideFooter={hideFooter} hideHeader={hideHeader} {...props}>
        {children}
        <Toaster richColors position="top-right" />
    </AppLayoutTemplate>
);
