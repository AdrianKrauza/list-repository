const puppeteer = require('puppeteer');
const gitPass = require('./gitPass.js');
const args = process.argv;
let name = '';
for (x = 2; x <= args.length - 1; x++) {
	name === '' ? (name += args[x]) : (name += '-' + args[x]);
}
(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://github.com/login', {
		waitUntil: 'networkidle0'
	});
	await page.type('#login_field', gitPass.login);
	await page.type('#password', gitPass.password);
	await page.click('input[type="submit"]');
	const page2 = await browser.newPage();
	await page2.goto('https://github.com');
	await page2.waitFor(500);
	await page2.click('body > div.application-main > div > aside > div > div > div > form > button');
	await page2.waitFor(1000);
	const data = await page2.evaluate(() => [
		...document.querySelectorAll(
			'body > div > div > aside > div > div > div > ul > li > div > a > span:nth-child(3)'
		)
	].map((elem) => elem.innerText));
	data.map((value) => {
		console.log('   ' + value);
	});
	await browser.close();
})();