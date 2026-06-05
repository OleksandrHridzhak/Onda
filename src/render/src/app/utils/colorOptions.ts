export interface ColorOption {
    bg: string;
    text: string;
    solid: string;
    hover: string;
    cssVar: string;
}

export const COLOR_ORDER = [
    'accent1',
    'accent2',
    'accent3',
    'accent4',
    'accent5',
    'accent6',
    'accent7',
    'accent8',
    'accent9',
    'accent10',
] as const;

export type ColorName = (typeof COLOR_ORDER)[number];

export const DEFAULT_COLOR_NAME: ColorName = 'accent2';

export const COLOR_STYLES: Record<ColorName, ColorOption> = {
    accent1: {
        bg: 'bg-colorAccent1Bg',
        text: 'text-colorAccent1Text',
        solid: 'bg-colorAccent1Solid',
        hover: 'hover:bg-colorAccent1Hover',
        cssVar: '--color-accent1-solid',
    },
    accent2: {
        bg: 'bg-colorAccent2Bg',
        text: 'text-colorAccent2Text',
        solid: 'bg-colorAccent2Solid',
        hover: 'hover:bg-colorAccent2Hover',
        cssVar: '--color-accent2-solid',
    },
    accent3: {
        bg: 'bg-colorAccent3Bg',
        text: 'text-colorAccent3Text',
        solid: 'bg-colorAccent3Solid',
        hover: 'hover:bg-colorAccent3Hover',
        cssVar: '--color-accent3-solid',
    },
    accent4: {
        bg: 'bg-colorAccent4Bg',
        text: 'text-colorAccent4Text',
        solid: 'bg-colorAccent4Solid',
        hover: 'hover:bg-colorAccent4Hover',
        cssVar: '--color-accent4-solid',
    },
    accent5: {
        bg: 'bg-colorAccent5Bg',
        text: 'text-colorAccent5Text',
        solid: 'bg-colorAccent5Solid',
        hover: 'hover:bg-colorAccent5Hover',
        cssVar: '--color-accent5-solid',
    },
    accent6: {
        bg: 'bg-colorAccent6Bg',
        text: 'text-colorAccent6Text',
        solid: 'bg-colorAccent6Solid',
        hover: 'hover:bg-colorAccent6Hover',
        cssVar: '--color-accent6-solid',
    },
    accent7: {
        bg: 'bg-colorAccent7Bg',
        text: 'text-colorAccent7Text',
        solid: 'bg-colorAccent7Solid',
        hover: 'hover:bg-colorAccent7Hover',
        cssVar: '--color-accent7-solid',
    },
    accent8: {
        bg: 'bg-colorAccent8Bg',
        text: 'text-colorAccent8Text',
        solid: 'bg-colorAccent8Solid',
        hover: 'hover:bg-colorAccent8Hover',
        cssVar: '--color-accent8-solid',
    },
    accent9: {
        bg: 'bg-colorAccent9Bg',
        text: 'text-colorAccent9Text',
        solid: 'bg-colorAccent9Solid',
        hover: 'hover:bg-colorAccent9Hover',
        cssVar: '--color-accent9-solid',
    },
    accent10: {
        bg: 'bg-colorAccent10Bg',
        text: 'text-colorAccent10Text',
        solid: 'bg-colorAccent10Solid',
        hover: 'hover:bg-colorAccent10Hover',
        cssVar: '--color-accent10-solid',
    },
};
