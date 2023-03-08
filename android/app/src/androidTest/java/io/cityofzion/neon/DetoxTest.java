package io.cityofzion.neon;

import com.wix.detox.Detox;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;
import androidx.test.rule.ActivityTestRule;
import androidx.test.runner.AndroidJUnit4;

@RunWith(AndroidJUnit4.class)
public class DetoxTest {
  @Rule
  public ActivityTestRule<MainActivity> mActivityRule = new ActivityTestRule<>(MainActivity.class, false, false);

  @Test
  public void runDetoxTests() {
    mActivityRule.launchActivity(null);
    Detox.runTests(mActivityRule.getActivity());
  }
}
