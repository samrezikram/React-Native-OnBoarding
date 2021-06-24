import React from 'react';
import { ThemeStyleType } from '@eva-design/dss';
import { ModalPanel, ThemeType } from 'react-native-ui-kitten';
import { StyleProvider } from 'react-native-ui-kitten/theme/style/styleProvider.component';

interface IThemeProviderProps {
  theme: ThemeType;
}
interface IState {
  styles: ThemeStyleType;
}

export class ThemeProvider extends React.Component<IThemeProviderProps, IState> {

  private static readonly mappings: ThemeStyleType = require('./pre-processed-mappings');

  public state: IState = {
    styles: ThemeProvider.mappings
  };

  constructor(props: IThemeProviderProps) {
    super(props);
  }

  public render(): React.ReactNode {
    return (
      <StyleProvider theme={this.props.theme} styles={this.state.styles}>
        <ModalPanel>
          {this.props.children}
        </ModalPanel>
      </StyleProvider>
    );
  }
}
