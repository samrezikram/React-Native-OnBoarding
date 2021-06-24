import { InputValidity } from '@enums/input-validity.enum';

export interface IInputValidationResult {
  validity: InputValidity;
  message: string;
}
