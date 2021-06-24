import { ThemeName } from '@enums/theme-name.enum';
import { ITheme } from '@models/app/theme.model';

const Light = require('./light.json');
const Blue = require('./blue.json');
const Grey = require('./grey.json');

export const Themes: {[themeName: string]: ITheme} = {
  [ThemeName.Light]: Light,
  [ThemeName.Blue]: Blue,
  [ThemeName.Grey]: Grey
};
