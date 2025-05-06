import AppLogoIcon from './app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-md">
                <AppLogoIcon className="size-10 fill-current text-white dark:text-black" />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm text-white">
                <span className="mb-0.5 truncate leading-none font-bold text-lg">VIDE DRESSING</span>
                <span className="mb-0.5 truncate leading-none font-semibold text-xs">MARKETPLACE</span>
            </div>
        </>
    );
}
