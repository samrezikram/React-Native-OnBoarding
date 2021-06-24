import React from 'react';
import { Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import { ThemeProvider } from '@providers/theme-provider/theme.provider';

import { IGlobalState } from '@models/app/global-state.model';

import { ThemeName, ThemeKind } from '@enums/theme-name.enum';

import { Themes } from '@themes/index';

const platformIsIOS: boolean = Platform.OS == 'ios';
interface IMapStateToProps {
  themeName?: ThemeName;
  themeKind?: ThemeKind;
}

export interface IThemeHOCProps extends IMapStateToProps {
  children: React.ReactChild | React.ReactChildren | React.ReactElement | React.ReactNode;
}
// ----------------------------------

function ThemeHocComponent(props: IThemeHOCProps): React.ReactElement {
  return (
    <ThemeProvider theme={(props.themeName ? Themes[props.themeName] : Themes[ThemeName.Light]) as any}>
      { platformIsIOS ? // iOS have problems updating the statusbar color using RNN, So we use this component. Android is the opposite.
        (
        <StatusBar
          animated={true}
          barStyle={props.themeKind == ThemeKind.Dark ? 'light-content' : 'dark-content'} />
        ) :
          <React.Fragment />
      }
      {props.children}
    </ThemeProvider>
  );
}
// ----------------------------------

function mapStateToProps(state: IGlobalState): any {
  return {
    themeName: state.theme.themeName,
    themeKind: state.theme.themeKind
  };
}
// ----------------------------------

export const ThemeHOC = connect(mapStateToProps)(ThemeHocComponent);
// ---------------------------------------------------------------------------------------------------
