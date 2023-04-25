describe('First Test', () => {
    beforeAll(async () => {
        await device.launchApp()
    })

    it('Onboading Page is visible', async () => {
        await expect(element(by.id('onboarding-page'))).toBeVisible()
    })
})