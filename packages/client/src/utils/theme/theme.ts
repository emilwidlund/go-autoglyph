export interface IBaseSpec {
    fontSize: Record<'xsmall' | 'small' | 'medium' | 'large' | 'xlarge', number>;
    colors: {
        brand: Record<'primary' | 'secondary' | 'tertiary', string>;
        text: Record<'light' | 'dark', string>;
    };
    dimensions: {
        borderRadius: Record<'xsmall' | 'small' | 'medium' | 'large' | 'xlarge', number>;
    };
}

export interface IThemeSpec extends IBaseSpec {
    fontSize: Record<'xsmall' | 'small' | 'medium' | 'large' | 'xlarge', number>;
    colors: {
        brand: Record<'primary' | 'secondary' | 'tertiary', string>;
        text: Record<'default' | 'neutral' | 'light' | 'dark', string>;
    };
    dimensions: {
        borderRadius: Record<'xsmall' | 'small' | 'medium' | 'large' | 'xlarge', number>;
    };
}

export const baseTheme: IBaseSpec = {
    fontSize: {
        xsmall: 12,
        small: 14,
        medium: 16,
        large: 24,
        xlarge: 32
    },
    colors: {
        brand: {
            primary: '#2222ff',
            secondary: '#6666ff',
            tertiary: '#ff6666'
        },
        text: {
            dark: '#000',
            light: '#fff'
        }
    },
    dimensions: {
        borderRadius: {
            xsmall: 2,
            small: 4,
            medium: 8,
            large: 12,
            xlarge: 16
        }
    }
};

export const lightTheme: IThemeSpec = {
    ...baseTheme,
    colors: {
        ...baseTheme.colors,
        text: {
            default: '#000',
            neutral: 'rgba(0, 0, 0, .3)',
            ...baseTheme.colors.text
        }
    }
};

export const darkTheme: IThemeSpec = {
    ...baseTheme,
    colors: {
        ...baseTheme.colors,
        text: {
            default: '#fff',
            neutral: 'rgba(255, 255, 255, .5)',
            ...baseTheme.colors.text
        }
    }
};
