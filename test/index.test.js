const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

const service = new chrome.ServiceBuilder('./chromedriver');
const driver = new Builder().forBrowser('chrome').setChromeService(service).build();

const url =
  'https://gws-staging-content-service-cms.bhinneka.com/promo/?token=2fdaa250e1140d9234bdffa5c4b847742bd4f8af72196af1ff2c9007ca39571a8480ab69ba066270670467145174c8d6735a63ea88be82baec61f2f9de9ffa2c';

describe('Create new promo page', function () {
  after(() => driver.quit());

  it('should open dialog and create new', async function () {
    await driver.get(url);

    const title = await driver.getTitle();
    assert.equal('Promotion Page', title);

    await driver.manage().setTimeouts({ implicit: 500 });

    const sectionHeader = await driver.findElement(By.className('bt-section-header'));
    const buttonAdd = await sectionHeader.findElement(By.css('button'));
    await buttonAdd.click();

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const dialog = await driver.findElement(By.className('ant-modal-content'));
    assert.equal(await dialog.isDisplayed(), true);

    const textName = await dialog.findElement(By.id('promoName'));
    await textName.sendKeys('SELENIUM-TEST');

    const selectClick = await dialog.findElement(By.className('ant-select-selection'));
    await selectClick.click();

    const selectItems = await driver.findElement(By.className('ant-select-dropdown-menu'));
    const aggregator = await selectItems.findElement(By.xpath('//li[text()="Aggregator"]'));

    await aggregator.click();

    await new Promise((resolve) => setTimeout(resolve, 500));

    const createButton = await dialog.findElement(By.className('ant-btn-primary'));
    await createButton.click();

    await new Promise((resolve) => setTimeout(resolve, 3000));
    const notificationNotice = await driver.findElement(By.className('ant-notification-notice'));
    const noticeSuccess = await notificationNotice.findElement(
      By.xpath('//*[text()="Add Page Success"]'),
    );

    assert(noticeSuccess.isDisplayed(), true);
  });
});
