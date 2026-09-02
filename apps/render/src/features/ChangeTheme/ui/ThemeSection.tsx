import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Check } from 'lucide-react';
import SettingsSection from 'shared/ui/SettingsSection';
import { Card } from 'shared/ui/Card';
import { Heading } from 'shared/ui/Heading';
import { Text } from 'shared/ui/Text';
import {
    selectColorScheme,
    selectFontFamily,
    selectThemeMode,
} from '../model/selectors';
import { setColorScheme, setFontFamily } from '../model/themeSlice';

const colorSchemes = [
    { value: 'standard', label: 'Standard' },
    { value: 'standard-v2', label: 'Standard v2' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'forest', label: 'Forest' },
    { value: 'lavender', label: 'Lavender' },
    { value: 'nord', label: 'Nord' },
    { value: 'coffee', label: 'Coffee' },
    { value: 'plush', label: 'Plush' },
    { value: 'executive', label: 'Executive' },
    { value: 'sport', label: 'Sport' },
    { value: 'rock', label: 'Rock & Roll' },
    { value: 'woodland', label: 'Woodland' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'matcha', label: 'Matcha' },
    { value: 'candy', label: 'Candy Pop' },
    { value: 'arctic', label: 'Arctic Glass' },
    { value: 'arcade', label: 'Retro Arcade' },
];

const fontFamilies = [
    { value: 'poppins', label: 'Poppins', family: 'Poppins' },
    { value: 'rubik', label: 'Rubik', family: 'Rubik' },
    { value: 'merriweather', label: 'Merriweather', family: 'Merriweather' },
    { value: 'quicksand', label: 'Quicksand', family: 'Quicksand' },
    {
        value: 'ibm-plex-sans',
        label: 'IBM Plex Sans',
        family: 'IBM Plex Sans',
    },
    { value: 'oswald', label: 'Oswald', family: 'Oswald' },
    { value: 'metal-mania', label: 'Metal Mania', family: 'Metal Mania' },
    { value: 'lora', label: 'Lora', family: 'Lora' },
    { value: 'pacifico', label: 'Pacifico', family: 'Pacifico' },
    {
        value: 'dancing-script',
        label: 'Dancing Script',
        family: 'Dancing Script',
    },
    { value: 'caveat', label: 'Caveat', family: 'Caveat' },
    {
        value: 'cormorant-garamond',
        label: 'Cormorant Garamond',
        family: 'Cormorant Garamond',
    },
    {
        value: 'cinzel-decorative',
        label: 'Cinzel Decorative',
        family: 'Cinzel Decorative',
    },
    { value: 'bungee', label: 'Bungee', family: 'Bungee' },
    {
        value: 'black-ops-one',
        label: 'Black Ops One',
        family: 'Black Ops One',
    },
    {
        value: 'playwrite-england-joined',
        label: 'Playwrite England Joined',
        family: 'Playwrite GB J',
    },
    { value: 'dm-sans', label: 'DM Sans', family: 'DM Sans' },
    {
        value: 'chelsea-market',
        label: 'Chelsea Market',
        family: 'Chelsea Market',
    },
    {
        value: 'bitcount-single',
        label: 'Bitcount Single',
        family: 'Bitcount Single',
    },
    { value: 'cinzel', label: 'Cinzel', family: 'Cinzel' },
    {
        value: 'google-sans-code',
        label: 'Google Sans Code',
        family: 'Google Sans Code',
    },
    {
        value: 'abril-fatface',
        label: 'Abril Fatface',
        family: 'Abril Fatface',
    },
    {
        value: 'lexend-deca',
        label: 'Lexend Deca',
        family: 'Lexend Deca',
    },
    {
        value: 'permanent-marker',
        label: 'Permanent Marker',
        family: 'Permanent Marker',
    },
    { value: 'righteous', label: 'Righteous', family: 'Righteous' },
    {
        value: 'gravitas-one',
        label: 'Gravitas One',
        family: 'Gravitas One',
    },
    {
        value: 'press-start-2p',
        label: 'Press Start 2P',
        family: 'Press Start 2P',
    },
    {
        value: 'luckiest-guy',
        label: 'Luckiest Guy',
        family: 'Luckiest Guy',
    },
    {
        value: 'dm-serif-text',
        label: 'DM Serif Text',
        family: 'DM Serif Text',
    },
    { value: 'creepster', label: 'Creepster', family: 'Creepster' },
    { value: 'fugaz-one', label: 'Fugaz One', family: 'Fugaz One' },
    { value: 'eater', label: 'Eater', family: 'Eater' },
    {
        value: 'racing-sans-one',
        label: 'Racing Sans One',
        family: 'Racing Sans One',
    },
    { value: 'pirata-one', label: 'Pirata One', family: 'Pirata One' },
    {
        value: 'rubik-glitch',
        label: 'Rubik Glitch',
        family: 'Rubik Glitch',
    },
    { value: 'ribeye', label: 'Ribeye', family: 'Ribeye' },
];

export default function ThemeSection(): React.ReactElement {
    const dispatch = useDispatch();
    const colorScheme = useSelector(selectColorScheme);
    const fontFamily = useSelector(selectFontFamily);
    const themeMode = useSelector(selectThemeMode);

    return (
        <SettingsSection title="Appearance">
            <div className="space-y-3">
                <div>
                    <Heading as="h4" variant="s">
                        Color palette
                    </Heading>
                    <Text variant="caption" tone="subtle">
                        Preview and select a palette for light and dark modes.
                    </Text>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {colorSchemes.map((scheme) => {
                        const isSelected = colorScheme === scheme.value;

                        return (
                            <Card
                                key={scheme.value}
                                as="button"
                                onClick={() =>
                                    dispatch(setColorScheme(scheme.value))
                                }
                                ariaLabel={`Use ${scheme.label} color palette`}
                                ariaPressed={isSelected}
                                className={`overflow-hidden p-0 text-left transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor ${
                                    isSelected
                                        ? 'border-primaryColor ring-2 ring-primaryColor/30'
                                        : 'hover:border-primaryColor/40'
                                }`}
                            >
                                <div
                                    data-palette-preview={scheme.value}
                                    data-theme-mode={themeMode}
                                    className="h-24 bg-background p-3"
                                >
                                    <div className="flex h-full flex-col justify-between rounded-lg border border-border bg-surface p-2 shadow-sm">
                                        <div className="flex items-center justify-between">
                                            <div className="h-2 w-14 rounded-full bg-text opacity-75" />
                                            <div className="h-5 w-5 rounded-md bg-primaryColor" />
                                        </div>
                                        <div className="flex gap-2">
                                            <span className="h-5 flex-1 rounded bg-primaryColor" />
                                            <span className="h-5 flex-1 rounded bg-text" />
                                            <span className="h-5 flex-1 rounded bg-surfaceMuted" />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between px-3 py-2.5">
                                    <Text as="span" className="font-medium">
                                        {scheme.label}
                                    </Text>
                                    {isSelected ? (
                                        <Check
                                            size={16}
                                            className="text-primaryColor"
                                            aria-hidden="true"
                                        />
                                    ) : null}
                                </div>
                            </Card>
                        );
                    })}
                </div>
            </div>

            <div className="space-y-3 pt-3">
                <div>
                    <Heading as="h4" variant="s">
                        Font
                    </Heading>
                    <Text variant="caption" tone="subtle">
                        Select a typeface independently from the color palette.
                    </Text>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {fontFamilies.map((font) => {
                        const isSelected = fontFamily === font.value;

                        return (
                            <Card
                                key={font.value}
                                as="button"
                                onClick={() =>
                                    dispatch(setFontFamily(font.value))
                                }
                                ariaLabel={`Use ${font.label} font`}
                                ariaPressed={isSelected}
                                className={`relative min-h-28 p-4 text-left transition-all hover:-translate-y-0.5 hover:bg-surfaceMuted hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryColor ${
                                    isSelected
                                        ? 'border-primaryColor ring-2 ring-primaryColor/30'
                                        : 'hover:border-primaryColor/40'
                                }`}
                            >
                                {isSelected ? (
                                    <Check
                                        size={16}
                                        className="absolute right-3 top-3 text-primaryColor"
                                        aria-hidden="true"
                                    />
                                ) : null}
                                <div
                                    className="text-3xl text-text"
                                    style={{ fontFamily: font.family }}
                                >
                                    Aa
                                </div>
                                <div
                                    className="mt-2 truncate text-base text-text"
                                    style={{ fontFamily: font.family }}
                                >
                                    Onda planner
                                </div>
                                <Text
                                    variant="caption"
                                    tone="muted"
                                    className="mt-1"
                                >
                                    {font.label}
                                </Text>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </SettingsSection>
    );
}
