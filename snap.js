const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function debug() {
  let options = new chrome.Options();
  options.addArguments('--headless');
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  
  try {
    await driver.get('http://localhost:3000/auth/login');
    await driver.findElement(By.id('email')).sendKeys('officer@pwd.gov');
    await driver.findElement(By.id('password')).sendKeys('password123');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    await driver.wait(until.urlIs('http://localhost:3000/officer/dashboard'), 5000);
    await driver.sleep(2000); // let UI crash
    
    const logs = await driver.manage().logs().get('browser');
    console.log("BROWSER LOGS:");
    logs.forEach(log => console.log(log.message));
  } catch (e) {
    console.log("Selenium error:", e);
  } finally {
    await driver.quit();
  }
}
debug();
