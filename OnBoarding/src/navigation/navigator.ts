import React from 'react';
import { Navigation, ScreenPoppedEvent, ModalDismissedEvent } from 'react-native-navigation';
import { BehaviorSubject } from 'rxjs';

import { INavigationHistory, INavigationHistoryItem } from '@models/navigation-history.model';
import { NavigationRoot, ScreenRoute, ModalRoute, OverlayRoute, RouteType } from '@enums/routes.enum';


import _ from 'lodash';
import { generateUniqueID } from '@utils/id-generator.util';
import { IAppInitScreenProps } from '@screens/app-init/app-init.screen';
import { IGenericError, IFetchIssueGlobalError } from '@models/app/errors.model';
import { ErrorSource } from '@enums/error-sources.enum';

export class Navigator {


  public static currentRootId: NavigationRoot | null = null;
  private static navigationRootBehaviorSubject: BehaviorSubject<NavigationRoot | null> = new BehaviorSubject<NavigationRoot | null>(null);

  private static navigationHistory: INavigationHistory = {} as INavigationHistory;
  private static navigationCount: number = 0;

  private static screenPoppedListener: any = undefined;
  private static modalDismissedListener: any = undefined;

  private static overlaysAllowed: boolean = true;


  // Expose Navigation History ----------------------------------------------------------------------
  public static getNavigationHistory(): INavigationHistory {
    return _.cloneDeep(Navigator.navigationHistory || {} as INavigationHistory);
  }
  // ------------------------------------------------------------------------------------------------

  // Initializing Global Subscriptions --------------------------------------------------------------
  public static init(): void {
    if (!Navigator.screenPoppedListener) {
      Navigator.screenPoppedListener = Navigation.events().registerScreenPoppedListener((event: ScreenPoppedEvent) => {
        setTimeout(() => {
          if (event?.componentId) {
            const screenIndex: number = _.findIndex(Navigator.navigationHistory.stack, (item: INavigationHistoryItem) => (item.type == RouteType.SCREEN && item.id == event.componentId));
            if (screenIndex > -1) {
              Navigator.onScreenPopped(event.componentId);
            }
          }
        }, 0);
      });
    }
    if (!Navigator.modalDismissedListener) {
      Navigator.modalDismissedListener = Navigation.events().registerModalDismissedListener((event: ModalDismissedEvent) => {
        setTimeout(() => {
          if (event?.componentId) {
            const modalIndex: number = _.findIndex(Navigator.navigationHistory.stack, (item: INavigationHistoryItem) => (item.type == RouteType.MODAL && item.id == event.componentId));
            if (modalIndex > -1) {
              Navigator.onModalDismissed(event.componentId);
            }
          }
        }, 0);
      });
    }
  }
  // ------------------------------------------------------------------------------------------------

  // Helpers ----------------------------------------------------------------------------------------
  private static getNavigationCount(): string {
    Navigator.navigationCount += 1;
    return `${Navigator.navigationCount}`;
  }

    // Set App Initializer as Root --------------------------------------------------------------------
  public static async setAppInitAsRoot(propsToPass: IAppInitScreenProps = {} as IAppInitScreenProps): Promise<any> {
    const rootId: string = `${NavigationRoot.APP_INIT_ROOT}_${generateUniqueID()}_${Navigator.getNavigationCount()}`;
    const rootScreenId: string = `${ScreenRoute.APP_INIT_SCREEN}_${generateUniqueID()}_${Navigator.getNavigationCount()}`;
    return Navigation.setRoot({
      root: {
        stack: {
          id: rootId,
          children: [
            {
              component: {
                id: rootScreenId,
                name: ScreenRoute.APP_INIT_SCREEN,
                passProps: propsToPass
              }
            }
          ]
        }
      }
    }).then(() => {
      const currentOvrelays: INavigationHistoryItem[] = _.filter(Navigator.navigationHistory?.stack, (item: INavigationHistoryItem) => item.type == RouteType.OVERLAY);
      Navigator.navigationHistory = {
        root: {
          id: rootId,
          route: NavigationRoot.APP_INIT_ROOT,
          passedProps: null
        },
        stack: [{
          id: rootScreenId,
          type: RouteType.SCREEN,
          route: ScreenRoute.APP_INIT_SCREEN,
          passedProps: propsToPass
        }, ...currentOvrelays]
      };
      Navigator.emitNavigationRootEvent(NavigationRoot.APP_INIT_ROOT);
      return rootId;
    }).catch((e) => {
      return Navigator.reportNavigationError((_.isError(e) ? e : new Error), 'Failed to Set App Init as Root' + (e?.message ? ` - ${e.message}` : ''));
    });
  }
  // ------------------------------------------------------------------------------------------------

  // Set Mobile Number Register as Root -------------------------------------------------------------
  public static async setMainAsRoot(): Promise<any> {
    const rootId: string = `${NavigationRoot.MAIN_ROOT}_${generateUniqueID()}_${Navigator.getNavigationCount()}`;
    const rootScreenId: string = `${ScreenRoute.MAIN_SCREEN}_${generateUniqueID()}_${Navigator.getNavigationCount()}`;
    return Navigation.setRoot({
      root: {
        stack: {
          id: rootId,
          children: [
            {
              component: {
                id: rootScreenId,
                name: ScreenRoute.MAIN_SCREEN
              }
            }
          ]
        }
      }
    }).then(() => {
      const currentOvrelays: INavigationHistoryItem[] = _.filter(Navigator.navigationHistory?.stack, (item: INavigationHistoryItem) => item.type == RouteType.OVERLAY);
      Navigator.navigationHistory = {
        root: {
          id: rootId,
          route: NavigationRoot.MAIN_ROOT,
          passedProps: null
        },
        stack: [{
          id: rootScreenId,
          type: RouteType.SCREEN,
          route: ScreenRoute.MAIN_SCREEN,
          passedProps: null
        }, ...currentOvrelays]
      };
      Navigator.emitNavigationRootEvent(NavigationRoot.MAIN_ROOT);
      return rootId;
    }).catch((e) => {
      return Navigator.reportNavigationError((_.isError(e) ? e : new Error), 'Failed to Set Mobile Registration as Root' + (e?.message ? ` - ${e.message}` : ''));
    });
  }
  // ------------------------------------------------------------------------------------------------

  // Push Screen ------------------------------------------------------------------------------------
  /**
   *
   * @param componentId
   * @param destinationScreen
   * @param propsToPass
   * @description Push a new screen into this screen's navigation stack.
   */
   public static async pushScreen(compId: ScreenRoute | ModalRoute | string, screenRoute: ScreenRoute, propsToPass: object = {}): Promise<any> {
    const newScreenId: string = `${screenRoute}_${generateUniqueID()}_${Navigator.getNavigationCount()}`;
    return Navigation.push(compId, {
      component: {
        id: newScreenId,
        name: screenRoute,
        passProps: propsToPass
      }
    }).then(() => {
      Navigator.navigationHistory.stack.push({
        id: newScreenId,
        type: RouteType.SCREEN,
        route: screenRoute,
        passedProps: propsToPass
      });
      return newScreenId;
    }).catch((e) => {
      return Navigator.reportNavigationError((_.isError(e) ? e : new Error), `Failed to Push Screen: ${screenRoute} - Based onn ComponentId: ${compId}` + (e?.message ? ` - ${e.message}` : ''));
    });
  }
  // ------------------------------------------------------------------------------------------------

   // Pop Screen -------------------------------------------------------------------------------------
  /**
   *
   * @param componentId
   * @description Pop the top screen from this screen's navigation stack
   */
  public static async popScreen(componentId: ScreenRoute | ModalRoute | string): Promise<any> {
    return Navigation.pop(componentId).then(() => {
      Navigator.onScreenPopped(componentId);
      return componentId;
    }).catch((e) => {
      return Navigator.reportNavigationError((_.isError(e) ? e : new Error), `Failed Popping Screen: ${stripIdFromRoute(componentId)}` + (e?.message ? ` - ${e.message}` : ''));
    });
  }
  // ----------------------

  private static onScreenPopped(componentId: ScreenRoute | ModalRoute | string): void {
    const poppedScreenIndex: number = _.findIndex(Navigator.navigationHistory.stack, (stackItem: INavigationHistoryItem) => {
      return stackItem.id == componentId && stackItem.type == RouteType.SCREEN;
    });
    if (poppedScreenIndex != undefined && poppedScreenIndex != null && poppedScreenIndex >= 0) {
      Navigator.navigationHistory.stack.splice(poppedScreenIndex, 1);
    }
    const currentVisibleScreen: ScreenRoute | ModalRoute | string = _.findLast(Navigator.navigationHistory.stack, (stackItem: INavigationHistoryItem) => {
      return stackItem.type != RouteType.OVERLAY;
    })?.route || 'Unknown';
  }
  // ------------------------------------------------------------------------------------------------

  private static onModalDismissed(componentId: ModalRoute | string): void {
    const dismissedModalIndex: number = _.findIndex(Navigator.navigationHistory.stack, (stackItem: INavigationHistoryItem) => {
      return stackItem.id == componentId && stackItem.type == RouteType.MODAL;
    });
    if (dismissedModalIndex != undefined && dismissedModalIndex != null && dismissedModalIndex >= 0) {
      Navigator.navigationHistory.stack.splice(dismissedModalIndex, 1);
    }
    const currentVisibleScreen: ScreenRoute | ModalRoute | string = _.findLast(Navigator.navigationHistory.stack, (stackItem: INavigationHistoryItem) => {
      return stackItem.type != RouteType.OVERLAY;
    })?.route || 'Unknown';
  }
  // ------------------------------------------------------------------------------------------------



  private static async reportNavigationError(stackTraceCapturer: Error, message: string): Promise<any> {
    const fetchGitHubGlobalError: IFetchIssueGlobalError = {} as IFetchIssueGlobalError;
    fetchGitHubGlobalError.source = ErrorSource.NAVIGATION_MODULE;
    fetchGitHubGlobalError.stackTraceCapturer = stackTraceCapturer;
    fetchGitHubGlobalError.errorDetails = {
      code: '0',
      message: message
    } as IGenericError;
    return Promise.reject(fetchGitHubGlobalError);
  }
  // ----------------------

  private static emitNavigationRootEvent(rootId: NavigationRoot | null): void {
    Navigator.currentRootId = rootId;
    Navigator.navigationRootBehaviorSubject.next(rootId);
  }

  // Show Overlay -----------------------------------------------------------------------------------
  /**
   *
   * @param componentId
   * @param propsToPass
   * @param interceptTouchOutside
   * @description Shows a component as an overlay.
   */
   public static async showOverlay(componentId: OverlayRoute, propsToPass: object = {}, interceptTouchOutside: boolean = true): Promise<any> {
    if (Navigator.overlaysAllowed) {
      const newOverlayId: string = `${componentId}_${generateUniqueID()}_${Navigator.getNavigationCount()}`;
      return Navigation.showOverlay({
        component: {
          id: newOverlayId,
          name: componentId,
          passProps: propsToPass,
          options: {
            layout: {
              backgroundColor: 'transparent',
            },
            overlay: {
              interceptTouchOutside: interceptTouchOutside
            }
          }
        }
      }).then(() => {
        Navigator.navigationHistory.stack.push({
          id: newOverlayId,
          type: RouteType.OVERLAY,
          route: componentId,
          passedProps: propsToPass
        });
        return newOverlayId;
      }).catch((e) => {
        return Navigator.reportNavigationError((_.isError(e) ? e : new Error), `Failed To Show Overlay: ${stripIdFromRoute(componentId)}` + (e?.message ? ` - ${e.message}` : ''));
      });
    } else {
      return Promise.resolve(false);
    }
  }
  // ------------------------------------------------------------------------------------------------

  // Dismiss Overlay --------------------------------------------------------------------------------
  /**
   *
   * @param componentId
   * @description Dismisses an overlay matching the given overlay componentId.
   */
  public static async dismissOverlay(componentId: OverlayRoute | string): Promise<any> {
    return Navigation.dismissOverlay(componentId).then(() => {
      const dismissedOverlayIndex: number = _.findIndex(Navigator.navigationHistory.stack, (stackItem: INavigationHistoryItem) => {
        return stackItem.id == componentId && stackItem.type == RouteType.OVERLAY;
      });
      if (dismissedOverlayIndex != undefined && dismissedOverlayIndex != null && dismissedOverlayIndex >= 0) {
        Navigator.navigationHistory.stack.splice(dismissedOverlayIndex, 1);
      }
      return componentId;
    }).catch((e) => {
      return Navigator.reportNavigationError((_.isError(e) ? e : new Error), `Failed To Dismiss Overlay: ${stripIdFromRoute(componentId)}` + (e?.message ? ` - ${e.message}` : ''));
    });
  }
  // ------------------------------------------------------------------------------------------------
}

// Helpers ------------------------------------------------------------------------------------------
function stripIdFromRoute(componentId: string): string {
  if (componentId && componentId.indexOf('_') >= 0) {
    const lastUnderScoreIndex: number = _.findLastIndex(componentId, (char: string) => {
      return char == '_';
    });
    if (lastUnderScoreIndex > 0) {
      return componentId.substring(0, lastUnderScoreIndex);
    } else {
      return `${componentId}`;
    }
  } else {
    return `${componentId}`;
  }
}
// --------------------------------------------------------------------------------------------------


// --------------------------------------------------------------------------------------------------
