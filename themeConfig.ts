import {StatusBar} from 'react-native';

export const fastImageVariants = {
  defaults: {},
};

export const buttonVariants = {
  defaults: {},
};

export const containerVariants = {
  defaults: {},
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    paddingTop: StatusBar.currentHeight,
    flex: 1,
  },
};

export const textVariants = {
  defaults: {},
};

export const spacing = {
  xxs: 4,
  xs: 8,
  s: 12,
  m: 16,
  l: 20,
  xL: 24,
  xxL: 28,
};

export const colors = {
  '#61DAFB': '#61DAFB',
  '#FB61DA': '#FB61DA',
  '#DAFB61': '#DAFB61',
  '#61FBCF': '#61FBCF',
  '#F4CE14': '#F4CE14',
  white: 'white',
  yellow: 'yellow',
  black: 'black',
  '#f5f5f5': '#f5f5f5',
  '#495E57': '#495E57',
  '#ecf0f1': '#ecf0f1',
  overlayBackground: 'rgba(0, 0, 0, 0.1)',
  transparent: 'transparent',
};
