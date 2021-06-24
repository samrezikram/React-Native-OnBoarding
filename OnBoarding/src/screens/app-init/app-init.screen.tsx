import React from 'react';
import { StyleSheet } from 'react-native';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Layout } from 'react-native-ui-kitten';
import SplashScreen from 'react-native-splash-screen';

import { initAppStateAsync } from '@actions/app.actions';
import { initThemeStateAsync } from '@actions/theme.actions';

import { IAppScreen } from '@interfaces/app-screen.interface';
import { IAppScreenProps } from '@interfaces/app-screen-props.interface';

import { IGlobalState, IAppState, IThemeState } from '@models/app/global-state.model';
import { Navigator } from '@navigation/navigator';

interface IMapDispatchToProps {
  initAppStateAsync: typeof initAppStateAsync;
  initThemeStateAsync: typeof initThemeStateAsync;
}

interface IMapStateToProps {
  appState: IAppState;
  themeState: IThemeState;
}

export interface IAppInitScreenState {}
export interface IAppInitScreenProps extends IAppScreenProps, IMapStateToProps, IMapDispatchToProps {
  initiatedFromFreshAppLaunch?: boolean; // To indicate that this screen was launched from Navigation.init class, as a result of app launch event
}

class AppInitScreenComponent extends React.Component<IAppInitScreenProps, IAppInitScreenState> implements IAppScreen {

  constructor(props: IAppInitScreenProps) {
    super(props);
  }

  componentDidMount(): void {
    this.props.initAppStateAsync();
    this.props.initThemeStateAsync();
  }
  // ---------------------

  componentDidUpdate() {
    this.routeBasedOnDerivedInitialState();

    if (this.props.appState.doneInitializing &&  this.props.themeState.doneInitializing) {
      try {
        SplashScreen.hide();
      } catch (error) {}
    }
  }
  // ---------------------

  private routeBasedOnDerivedInitialState(): void {
    SplashScreen.hide();
    Navigator.setMainAsRoot();
  }
  // ---------------------

  render(): React.ReactElement {
    return <Layout level="1" style={styles.container} />;
  }
  // ----------------------------------------------------------------------------------------
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0
  }
});

// Connecting To Redux ----------------------------------------------------------------------
function mapStateToProps(state: IGlobalState): any {
  return {
    appState: state.app,
    themeState: state.theme
  };
}
// -----------

function mapDispatchToProps(dispatch: Dispatch<any>): any {
  return {
    ...bindActionCreators({
      initAppStateAsync,
      initThemeStateAsync,
    }, dispatch),
  };
}
// ----------------------------------

export const AppInitScreen = connect(mapStateToProps, mapDispatchToProps)(AppInitScreenComponent);
// ------------------------------------------------------------------------------------------