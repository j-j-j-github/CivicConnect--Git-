const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function debug() {
  let options = new chrome.Options();
  options.addArguments('--headless');
  let driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
  
  try {
    console.log("Navigating to login...");
    await driver.get('http://localhost:3000/auth/login');
    await driver.findElement(By.id('email')).sendKeys('officer@pwd.gov');
    await driver.findElement(By.id('password')).sendKeys('password123');
    await driver.findElement(By.css('button[type="submit"]')).click();
    
    console.log("Waiting for dashboard...");
    await driver.wait(until.urlIs('http://localhost:3000/officer/dashboard'), 5000);
    
    // Wait a bit to let it crash
    await driver.sleep(2000);
    
    console.log("Fetching browser logs...");
    const logs = await driver.manage().logs().get('browser');
    logs.forEach(log => console.log(`[${log.level.name}] ${log.message}`));
    
    console.log("Done.");
  } catch (e) {
    console.error("Script failed:", e);
  } finally {
    await driver.quit();
  }
}
debug();
