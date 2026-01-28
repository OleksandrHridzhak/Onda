import { Home, Calendar1, Settings, LucideIcon } from 'lucide-react';

export interface SideBarItem {
    name: string;
    icon: LucideIcon;
    path: string;
}

export const sideBarItems: SideBarItem[] = [
    { name: 'home', icon: Home, path: '/' },
    { name: 'calendar', icon: Calendar1, path: '/calendar' },
    { name: 'settings', icon: Settings, path: '/settings' },
];
