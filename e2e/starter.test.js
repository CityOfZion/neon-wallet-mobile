describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('teste se onboarding esta visivel', async () => {
    const abc = await element(by.id('onboarding'));
    expect(abc).toBeVisible();
  });
});
