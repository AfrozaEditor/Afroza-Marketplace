import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="text-sidebar-primary-foreground flex aspect-square size-16 items-center justify-center rounded-md">
                <AppLogoIcon />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="truncate leading-none font-bold text-lg text-gray-900 dark:text-white">AFROZA</span>
                <span className="truncate leading-none font-semibold text-xs text-primary">MARKETPLACE</span>
            </div>
        </>
    );
}
