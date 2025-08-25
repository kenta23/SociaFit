/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColor = '#24B437';
const tintColorDark = '#54EE69';

type TextColors = {
  0: string;
  50: string;
  200: string;
  400: string;
  600: string;
  800: string;
}

interface ColorSchemeType extends Omit<TextColors, '800' | '0'> {
  700: string;
}

type ColorScheme = {
  text: TextColors;
  background: string;
  primary: string;
  green: ColorSchemeType;
  yellow: ColorSchemeType;
  pink: ColorSchemeType;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  frameBackground: string;
}

type colorType = {
  light: ColorScheme;
  dark: ColorScheme;
}

export const Colors: colorType = {
  light: {
    text: { 
      0: '#000000',
      50: '#DBDADA',
      200: '#B5B1B1',
      400: '#7B7B7B',
      600: '#585757',
      800: '#272626',
    },
    background: '#fff',
    primary: '#54EE69',
    green: {
      50: '#E0FEE4',
      200: '#73EE84',
      400: '#54E067',
      600: '#24B437',
      700: '#1B7628',
      0: "",
      800: ""
    },
    yellow: {
      50: '#F4ECD0',
      200: '#EEDB73',
      400: '#E0CB54',
      600: '#B4A324',
      700: '#766E1B',
      0: "",
      800: ""
    },
    pink: {
      50: '#F5D3E8',
      200: '#EE73A9',
      400: '#E0548C',
      600: '#B42469',
      700: '#761B38',
      0: "",
      800: ""
    },
    frameBackground: 'rgba(172,172,172,0.2)',
    tint: tintColor,
    icon: '#fff',
    tabIconDefault: '#fff',
    tabIconSelected: tintColor,
  },
  dark: {
    text: {
      0: '#FFFFFF',
      50: '#DBDADA',
      200: '#B5B1B1',
      400: '#7B7B7B',
      600: '#585757',
      800: '#272626',
    },
    frameBackground: 'rgba(172,172,172,0.1)',
    background: '#222520', //change values you want
    tint: tintColorDark,
    icon: '#fff',
    tabIconDefault: '#fff',
    tabIconSelected: tintColorDark,
    primary: "",
    green: {
      50: '#E0FEE4',
      200: '#73EE84',
      400: '#54E067',
      600: '#24B437',
      700: '#1B7628',
      0: "",
      800: ""
    },
    yellow: {
      50: '#F4ECD0',
      200: '#EEDB73',
      400: '#E0CB54',
      600: '#B4A324',
      700: '#766E1B',
      0: "",
      800: ""
    },
    pink: {
      50: '#F5D3E8',
      200: '#EE73A9',
      400: '#E0548C',
      600: '#B42469',
      700: '#761B38',
      0: "",
      800: ""
    },
  },
};
