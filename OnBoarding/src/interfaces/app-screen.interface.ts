export interface IAppScreen {
  render: () => React.ReactElement;
  componentDidAppear?: () => void;
  componentDidDisappear?: () => void;
}
