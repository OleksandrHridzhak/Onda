export interface ColorOption {
    bg: string;
    text: string;
}

export const COLOR_ORDER = [
    'green',
    'blue',
    'purple',
    'orange',
    'yellow',
    'red',
    'pink',
    'teal',
    'gray',
    'lime',
] as const;

export type ColorName = (typeof COLOR_ORDER)[number];

export const DEFAULT_COLOR_NAME: ColorName = 'blue';

export const COLOR_STYLES: Record<ColorName, ColorOption> = {
    green: { bg: 'bg-colorGreenBg', text: 'text-colorGreenText' },
    blue: { bg: 'bg-colorBlueBg', text: 'text-colorBlueText' },
    purple: { bg: 'bg-colorPurpleBg', text: 'text-colorPurpleText' },
    orange: { bg: 'bg-colorOrangeBg', text: 'text-colorOrangeText' },
    yellow: { bg: 'bg-colorYellowBg', text: 'text-colorYellowText' },
    red: { bg: 'bg-colorRedBg', text: 'text-colorRedText' },
    pink: { bg: 'bg-colorPinkBg', text: 'text-colorPinkText' },
    teal: { bg: 'bg-colorTealBg', text: 'text-colorTealText' },
    gray: { bg: 'bg-colorGrayBg', text: 'text-colorGrayText' },
    lime: { bg: 'bg-colorLimeBg', text: 'text-colorLimeText' },
};
