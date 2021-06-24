import { NavigationRoot, ScreenRoute, ModalRoute, OverlayRoute, RouteType } from '@enums/routes.enum';

export interface INavigationHistory {
  root: INavigationHistoryRoot;
  stack: INavigationHistoryItem[];
}

export interface INavigationHistoryRoot {
  id: string;
  route: NavigationRoot;
  passedProps: any;
}

export interface INavigationHistoryItem {
  id: string;
  type: RouteType;
  route: ScreenRoute | ModalRoute | OverlayRoute;
  passedProps: any;
}
