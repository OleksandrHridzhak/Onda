import {
  Heart, Star, Zap, Sun, Moon, 
  Coffee, Rocket, Shield, Flag, Bell,
  Book, Music, Pizza, Gamepad,
  Camera, Clock, Globe, Lock, Map,
  Mic, Pen, Phone, Search, User, BicepsFlexed
} from 'lucide-react';

// Масив із визначенням іконок
export const icons = [
  { name: 'Heart', component: Heart },
  { name: 'Star', component: Star },
  { name: 'Zap', component: Zap },
  { name: 'Sun', component: Sun },
  { name: 'Moon', component: Moon },
  { name: 'Coffee', component: Coffee },
  { name: 'Rocket', component: Rocket },
  { name: 'Shield', component: Shield },
  { name: 'Flag', component: Flag },
  { name: 'Bell', component: Bell },
  { name: 'Book', component: Book },
  { name: 'Music', component: Music },
  { name: 'Pizza', component: Pizza },
  { name: 'Gamepad', component: Gamepad },
  { name: 'Camera', component: Camera },
  { name: 'Clock', component: Clock },
  { name: 'Globe', component: Globe },
  { name: 'Lock', component: Lock },
  { name: 'Map', component: Map },
  { name: 'Mic', component: Mic },
  { name: 'Pen', component: Pen },
  { name: 'Phone', component: Phone },
  { name: 'Search', component: Search },
  { name: 'User', component: User },
  { name: 'BicepsFlexed', component: BicepsFlexed }
];

// Функція для рендерингу іконки з потрібним розміром
export const getIconComponent = (iconName, size = 16) => {
  const icon = icons.find(i => i.name === iconName);
  if (!icon) return null;
  const IconComponent = icon.component;
  return <IconComponent size={size} />;
};