import AppLogoIcon from '@/assets/images/tankayo.png';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-8 items-center justify-center rounded-md  text-sidebar-primary-foreground">
                <img
                    src={AppLogoIcon}
                    alt="Logo Tankayo"
                    className="h-9 w-9 rounded-md object-cover"
                />
            </div>
            <div className="ml-1 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-tight font-semibold">
                    SISTEM-HOMESTAY
                </span>
                <span className="truncate text-xs text-muted-background">
                  Tankayo EcoPark Syariah 
                </span>
            </div>
        </>
    );
}
