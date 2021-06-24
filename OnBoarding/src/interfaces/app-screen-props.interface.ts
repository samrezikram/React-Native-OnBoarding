import { ScreenRoute, ModalRoute } from '@enums/routes.enum';
export interface IAppScreenProps {
  componentId: ScreenRoute | ModalRoute | string;
}
