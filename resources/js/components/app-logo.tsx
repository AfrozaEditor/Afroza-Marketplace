import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="text-sidebar-primary-foreground flex aspect-square size-20 items-center justify-center rounded-md">
                <AppLogoIcon />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm text-white">
                <span className="mb-2 truncate leading-none font-bold text-lg">AFROZA</span>
                <span className="mb-2 truncate leading-none font-semibold text-xs">MARKETPLACE</span>
            </div>
        </>
    );
}
