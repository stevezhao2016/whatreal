import { browser, element, by, ExpectedConditions } from 'protractor';

const numDashboardTabs = 5;
const numCrises = 4;
const numUsers = 10;
const EC = ExpectedConditions;

describe('Router', () => {

  beforeAll(() => browser.get(''));

  function getPageStruct() {
    const hrefEles = element.all(by.css('app-root > nav a'));
    const crisisDetail = element.all(by.css('app-root > div > app-crisis-center > app-crisis-list > app-crisis-detail > div')).first();
    const userDetail = element(by.css('app-root > div > app-user-detail'));

    return {
      hrefs: hrefEles,
      activeHref: element(by.css('app-root > nav a.active')),

      crisisHref: hrefEles.get(0),
      crisisList: element.all(by.css('app-root > div > app-crisis-center > app-crisis-list li')),
      crisisDetail,
      crisisDetailTitle: crisisDetail.element(by.xpath('*[1]')),

      usersHref: hrefEles.get(1),
      usersList: element.all(by.css('app-root > div > app-user-list li')),
      userDetail,
      userDetailTitle: userDetail.element(by.xpath('*[2]')),

      adminHref: hrefEles.get(2),
      adminPage: element(by.css('app-root > div > app-admin')),
      adminPreloadList: element.all(by.css('app-root > div > app-admin > app-admin-dashboard > ul > li')),

      loginHref: hrefEles.get(3),
      loginButton: element.all(by.css('app-root > div > app-login > p > button')),

      contactHref: hrefEles.get(4),
      contactCancelButton: element.all(by.buttonText('Cancel')),

      primaryOutlet: element.all(by.css('app-root > div > app-user-list')),
      secondaryOutlet: element.all(by.css('app-root > app-compose-message'))
    };
  }

  it('has expected dashboard tabs', () => {
    const page = getPageStruct();
    expect(page.hrefs.count()).toEqual(numDashboardTabs, 'dashboard tab count');
    expect(page.crisisHref.getText()).toEqual('Crisis Center');
    expect(page.usersHref.getText()).toEqual('Users');
    expect(page.adminHref.getText()).toEqual('Admin');
    expect(page.loginHref.getText()).toEqual('Login');
    expect(page.contactHref.getText()).toEqual('Contact');
  });

  it('has users selected as opening tab', () => {
    const page = getPageStruct();
    expect(page.activeHref.getText()).toEqual('Users');
  });

  it('has crises center items', async () => {
    const page = getPageStruct();
    await page.crisisHref.click();
    expect(page.activeHref.getText()).toEqual('Crisis Center');
    expect(page.crisisList.count()).toBe(numCrises, 'crisis list count');
  });

  it('has user items', async () => {
    const page = getPageStruct();
    await page.usersHref.click();
    expect(page.activeHref.getText()).toEqual('Users');
    expect(page.usersList.count()).toBe(numUsers, 'user list count');
  });

  it('toggles views', async () => {
    const page = getPageStruct();
    await page.crisisHref.click();
    expect(page.activeHref.getText()).toEqual('Crisis Center');
    expect(page.crisisList.count()).toBe(numCrises, 'crisis list count');
    await page.usersHref.click();
    expect(page.activeHref.getText()).toEqual('Users');
    expect(page.usersList.count()).toBe(numUsers, 'user list count');
  });

  it('saves changed crisis details', async () => {
    const page = getPageStruct();
    await page.crisisHref.click();
    await crisisCenterEdit(2, true);
  });

  // TODO: Figure out why this test is failing now
  xit('can cancel changed crisis details', async () => {
    const page = getPageStruct();
    await page.crisisHref.click();
    await crisisCenterEdit(3, false);
  });

  it('saves changed user details', async () => {
    const page = getPageStruct();
    await page.usersHref.click();
    await browser.sleep(600);
    const userEle = page.usersList.get(4);
    const text = await userEle.getText();
    expect(text.length).toBeGreaterThan(0, 'user item text length');
    // remove leading id from text
    const userText = text.substr(text.indexOf(' ')).trim();

    await userEle.click();
    await browser.sleep(600);
    expect(page.usersList.count()).toBe(0, 'user list count');
    expect(page.userDetail.isPresent()).toBe(true, 'user detail');
    expect(page.userDetailTitle.getText()).toContain(userText);
    const inputEle = page.userDetail.element(by.css('input'));
    await inputEle.sendKeys('-foo');
    expect(page.userDetailTitle.getText()).toContain(userText + '-foo');

    const buttonEle = page.userDetail.element(by.css('button'));
    await buttonEle.click();
    await browser.sleep(600);
    expect(userEle.getText()).toContain(userText + '-foo');
  });

  it('sees preloaded modules', async () => {
    const page = getPageStruct();
    await page.loginHref.click();
    await page.loginButton.click();
    const list = page.adminPreloadList;
    expect(list.count()).toBe(1, 'preloaded module');
    expect(await list.first().getText()).toBe('crisis-center', 'first preloaded module');
  });

  it('sees the secondary route', async () => {
    const page = getPageStruct();
    await page.usersHref.click();
    await page.contactHref.click();
    expect(page.primaryOutlet.count()).toBe(1, 'primary outlet');
    expect(page.secondaryOutlet.count()).toBe(1, 'secondary outlet');
  });

  it('should redirect with secondary route', async () => {
    const page = getPageStruct();

    // go to login page and login
    await browser.get('');
    await page.loginHref.click();
    await page.loginButton.click();

    // open secondary outlet
    await page.contactHref.click();

    // go to login page and logout
    await page.loginHref.click();
    await page.loginButton.click();

    // attempt to go to admin page, redirects to login with secondary outlet open
    await page.adminHref.click();

    // login, get redirected back to admin with outlet still open
    await page.loginButton.click();

    expect(await page.adminPage.isDisplayed()).toBeTruthy();
    expect(page.secondaryOutlet.count()).toBeTruthy();
  });

  async function crisisCenterEdit(index: number, save: boolean) {
    const page = getPageStruct();
    await page.crisisHref.click();
    let crisisEle = page.crisisList.get(index);
    const text = await crisisEle.getText();
    expect(text.length).toBeGreaterThan(0, 'crisis item text length');
    // remove leading id from text
    const crisisText = text.substr(text.indexOf(' ')).trim();

    await crisisEle.click();
    expect(page.crisisDetail.isPresent()).toBe(true, 'crisis detail present');
    expect(page.crisisDetailTitle.getText()).toContain(crisisText);
    const inputEle = page.crisisDetail.element(by.css('input'));
    await inputEle.sendKeys('-foo');

    const buttonEle = page.crisisDetail.element(by.buttonText(save ? 'Save' : 'Cancel'));
    await buttonEle.click();
    crisisEle = page.crisisList.get(index);
    if (save) {
      expect(crisisEle.getText()).toContain(crisisText + '-foo');
    } else {
      await browser.wait(EC.alertIsPresent(), 4000);
      await browser.switchTo().alert().accept();
      expect(crisisEle.getText()).toContain(crisisText);
    }
  }

});
