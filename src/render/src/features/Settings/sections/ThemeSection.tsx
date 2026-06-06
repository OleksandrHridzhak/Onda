import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SettingsTemplate from 'features/Settings/SettingsTemplate';
import { Field } from 'shared/Field';
import { Select } from 'shared/Select';
import { setColorScheme } from 'app/store/slices/newThemeSlice';

interface RootState {
    newTheme: {
        colorScheme: string;
    };
}

const colorSchemes = [
    { value: 'standard', label: 'Standard' },
    { value: 'ocean', label: 'Ocean' },
    { value: 'sunset', label: 'Sunset' },
    { value: 'forest', label: 'Forest' },
    { value: 'lavender', label: 'Lavender' },
    { value: 'nord', label: 'Nord' },
    { value: 'coffee', label: 'Coffee' },
];

export default function ThemeSection(): React.ReactElement {
    const dispatch = useDispatch();
    const { colorScheme } = useSelector((state: RootState) => state.newTheme);

    return (
        <SettingsTemplate title="Appearance">
            <Field
                label="Color palette"
                htmlFor="settings-color-scheme"
                hint="Applies to light and dark modes."
            >
                <Select
                    id="settings-color-scheme"
                    value={colorScheme}
                    onChange={(event) =>
                        dispatch(setColorScheme(event.target.value))
                    }
                    inputSize="sm"
                >
                    {colorSchemes.map((scheme) => (
                        <option key={scheme.value} value={scheme.value}>
                            {scheme.label}
                        </option>
                    ))}
                </Select>
            </Field>
        </SettingsTemplate>
    );
}
