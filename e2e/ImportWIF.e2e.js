describe('Import WIF', () => {
    beforeAll(async () => {
        await device.launchApp()
    })

    it('Navigate to Setup Complete Screen', async () => {
        await waitFor(element(by.id('btn-continue-setup-complete')))
            .toBeVisible()
            .withTimeout(30000)

        await element(by.id('btn-continue-setup-complete')).tap()
    })

    it('Navigate to Home Screen', async () => {
        await element(by.id('btn-view-wallet-setup-complete')).tap()
    })

    it('Navigate to More Menu', async () => {
        await element(by.id('tab-btn-more')).tap()
    })

    it('Navigate to Import Screen', async () => {
        await element(by.id('menu-item-import-key')).tap()
    })

    it('Set valid WIF on Input Text Field', async () => {
        const wif = 'L4UqT3pyqX692YT3mGABWvHr8njgsk2BFpeHKBCZR9BpLdiKRrbd'
        await element(by.id('input-text-with-validation-import-key')).typeText(wif);
        await element(by.id('screen-import-key')).tap()
    })

    it('Finish Import', async () => {
        await waitFor(element(by.id('list-imported-import-key')))
            .toBeVisible()
            .withTimeout(5000)
        await element(by.id('btn-next-import-key')).tap()
    })
})