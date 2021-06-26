package com.onboarding;

import android.os.Bundle;

import androidx.annotation.Nullable;

import com.facebook.react.ReactActivity;
import com.reactnativenavigation.NavigationActivity;
import org.devio.rn.splashscreen.SplashScreen;

public class MainActivity extends NavigationActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected void onCreate(@Nullable Bundle savedInstanceState) {
    SplashScreen.show(this, R.style.AppTheme);
    super.onCreate(savedInstanceState);
  }
}
