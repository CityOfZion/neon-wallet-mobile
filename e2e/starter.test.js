describe('Example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('app was installed', async () => {
    expect(true).toBeTruthy()
  });
});
