const puppeteer = require('puppeteer');

async function fillGoogleForm (reqInfo) {
    let {
        nameOfClient,
        message,
        email,
    }=reqInfo;
    const browser = await puppeteer.launch({
        headless: 'new',
    })
    const page = await browser.newPage();
    await page.goto('https://forms.gle/NCpqc6rPEvRzhq3E9', { waitUntil: 'networkidle0' });

    // Fill out the form fields
    await page.waitForSelector('#mG61Hd > div.RH5hzf.RLS9Fe > div > div.o3Dpx > div:nth-child(1) > div > div > div.AgroKb > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input');
    await page.type('#mG61Hd > div.RH5hzf.RLS9Fe > div > div.o3Dpx > div:nth-child(1) > div > div > div.AgroKb > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input', nameOfClient);
    await page.type('#mG61Hd > div.RH5hzf.RLS9Fe > div > div.o3Dpx > div:nth-child(2) > div > div > div.AgroKb > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input', email);
    await page.type('#mG61Hd > div.RH5hzf.RLS9Fe > div > div.o3Dpx > div:nth-child(3) > div > div > div.AgroKb > div > div.aCsJod.oJeWuf > div > div.Xb9hP > input', message);

    // Submit the form
    await page.click('#mG61Hd > div.RH5hzf.RLS9Fe > div > div.ThHDze > div.DE3NNc.CekdCb > div.lRwqcd > div');
    await page.waitForSelector('body > div.Uc2NEf > div:nth-child(2) > div.RH5hzf.RLS9Fe > div > div.vHW8K');
    await browser.close();
}

module.exports.fillGoogleForm = fillGoogleForm;