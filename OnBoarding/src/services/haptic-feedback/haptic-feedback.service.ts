import ReactNativeHapticFeedback, { HapticOptions } from 'react-native-haptic-feedback';

class HapticFeedback {

  private static instance: HapticFeedback;
  private options: HapticOptions = {};

  private constructor() {}

  // Singleton Handling ----------------------------------------------------
  static _getInstance(): HapticFeedback {
    if (!HapticFeedback.instance) {
      HapticFeedback.instance = new HapticFeedback();
    }
    return HapticFeedback.instance;
  }
  // -----------------------------------------------------------------------

  // Public Methods --------------------------------------------------------
  public selection(): void {
    ReactNativeHapticFeedback.trigger('selection', this.options);
  }
  // --------------------

  public impactLight(): void {
    ReactNativeHapticFeedback.trigger('impactLight', this.options);
  }
  // --------------------

  public impactMedium(): void {
    ReactNativeHapticFeedback.trigger('impactMedium', this.options);
  }
  // --------------------

  public impactHeavy(): void {
    ReactNativeHapticFeedback.trigger('impactHeavy', this.options);
  }
  // --------------------

  public notificationSuccess(): void {
    ReactNativeHapticFeedback.trigger('notificationSuccess', this.options);
  }
  // --------------------

  public notificationWarning(): void {
    ReactNativeHapticFeedback.trigger('notificationWarning', this.options);
  }
  // --------------------

  public notificationError(): void {
    ReactNativeHapticFeedback.trigger('notificationError', this.options);
  }
  // -----------------------------------------------------------------------
}

export const HapticFeedbackService = HapticFeedback._getInstance();
