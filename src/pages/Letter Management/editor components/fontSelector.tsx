/* eslint-disable react-refresh/only-export-components */
import React, { useEffect } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// ─────────────────────────────────────────────────────────────────────────────
// Font catalogue – each item has a display name and the CSS font-family value.
// Fonts from Google Fonts are injected once via a <link> tag.
// ─────────────────────────────────────────────────────────────────────────────
export const FONTS: { label: string; value: string; google?: string }[] = [
    { label: 'Default', value: 'inherit' },
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Times New Roman', value: "'Times New Roman', Times, serif" },
    { label: 'Courier New', value: "'Courier New', Courier, monospace" },
    { label: 'Trebuchet MS', value: "'Trebuchet MS', sans-serif" },
    { label: 'Verdana', value: 'Verdana, Geneva, sans-serif' },
    { label: 'Inter', value: "'Inter', sans-serif", google: 'Inter' },
    { label: 'Roboto', value: "'Roboto', sans-serif", google: 'Roboto' },
    { label: 'Open Sans', value: "'Open Sans', sans-serif", google: 'Open+Sans' },
    { label: 'Lato', value: "'Lato', sans-serif", google: 'Lato' },
    { label: 'Montserrat', value: "'Montserrat', sans-serif", google: 'Montserrat' },
    { label: 'Poppins', value: "'Poppins', sans-serif", google: 'Poppins' },
    { label: 'Playfair Display', value: "'Playfair Display', serif", google: 'Playfair+Display' },
    { label: 'Merriweather', value: "'Merriweather', serif", google: 'Merriweather' },
    { label: 'Nunito', value: "'Nunito', sans-serif", google: 'Nunito' },
    { label: 'Raleway', value: "'Raleway', sans-serif", google: 'Raleway' },
    { label: 'Source Code Pro', value: "'Source Code Pro', monospace", google: 'Source+Code+Pro' },
    { label: 'Ubuntu', value: "'Ubuntu', sans-serif", google: 'Ubuntu' },
    { label: 'Oswald', value: "'Oswald', sans-serif", google: 'Oswald' },
    { label: 'PT Serif', value: "'PT Serif', serif", google: 'PT+Serif' },
    { label: 'Josefin Sans', value: "'Josefin Sans', sans-serif", google: 'Josefin+Sans' },
];

// Build & inject the Google Fonts link once
const GOOGLE_FAMILIES = FONTS.filter(f => f.google).map(f => f.google!).join('|');
const GOOGLE_FONT_URL = `https://fonts.googleapis.com/css2?family=${GOOGLE_FAMILIES.replace(/\|/g, '&family=')}&display=swap`;

/** Injects a single Google Fonts <link> into the document head, idempotently */
export function useInjectGoogleFonts() {
    useEffect(() => {
        if (document.getElementById('ess-editor-google-fonts')) return;
        const link = document.createElement('link');
        link.id = 'ess-editor-google-fonts';
        link.rel = 'stylesheet';
        link.href = GOOGLE_FONT_URL;
        document.head.appendChild(link);
    }, []);
}

interface FontSelectorProps {
    value: string;
    onChange: (v: string) => void;
    disabled?: boolean;
}

/**
 * Custom font selector built on shadcn Select.
 * Each option in the dropdown is rendered in its own corresponding typeface.
 */
export const FontSelector: React.FC<FontSelectorProps> = ({ value, onChange, disabled }) => {
    const currentFont = FONTS.find(f => f.value === value) ?? FONTS[0];

    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            {/* Trigger shows the selected font name rendered in that font */}
            <SelectTrigger
                className="h-7 text-xs w-full px-2"
                style={{ fontFamily: currentFont.value === 'inherit' ? undefined : currentFont.value }}
            >
                <SelectValue placeholder="Font" />
            </SelectTrigger>

            {/* Dropdown — each item is rendered in its own typeface */}
            <SelectContent className="max-h-72">
                {FONTS.map(font => (
                    <SelectItem
                        key={font.value}
                        value={font.value}
                        style={{ fontFamily: font.value === 'inherit' ? undefined : font.value }}
                        className="text-sm"
                    >
                        {font.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};
