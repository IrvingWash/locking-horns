import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
} from '@jest/globals';

import puppeteer, {
	Browser,
	Page,
} from 'puppeteer';

import { openLocalPage } from './utils';

describe('Locking horns', () => {
	let browser: Browser;
	let page1: Page;
	let page2: Page;

	beforeEach(async() => {
		browser = await puppeteer.launch({ headless: 'new' });

		page1 = await browser.newPage();
		page2 = await browser.newPage();

		await page1.goto(openLocalPage());
		await page2.goto(openLocalPage());
	});

	afterEach(async() => {
		await browser.close();
	});

	it('should send requests in the master tab', async() => {
		page1.setRequestInterception(true);

		let page1RequestCounter = 0;

		page1.on('request', () => page1RequestCounter++);

		await new Promise<void>((res: () => void) => setTimeout(async() => {
			expect(page1RequestCounter).toBeGreaterThan(0);

			res();
		}, 3000));
	}, 15000);

	it('should share data between tabs', async() => {
		const p1 = await page1.$$('p');
		const p2 = await page2.$$('p');

		await new Promise<void>((res: () => void) => setTimeout(async() => {
			const text1 = await page1.evaluate((element) => element?.textContent, p1[1]);
			const text2 = await page2.evaluate((element) => element?.textContent, p2[1]);

			expect(text1).toEqual(text2);

			res();
		}, 3000));
	}, 15000);

	it('should send requests in the master tab', async() => {
		page2.setRequestInterception(true);

		let page2RequestCounter = 0;

		page2.on('request', () => page2RequestCounter++);

		await new Promise<void>((res: () => void) => setTimeout(async() => {
			expect(page2RequestCounter).toBe(0);

			res();
		}, 3000));
	}, 15000);

	it('should reassign the master tab when the master tab closes', async() => {
		page1.setRequestInterception(true);
		page2.setRequestInterception(true);

		let page1RequestCounter = 0;
		let page2RequestCounter = 0;

		page1.on('request', () => page1RequestCounter++);
		page2.on('request', () => page2RequestCounter++);

		await new Promise<void>((res: () => void) => setTimeout(async() => {
			expect(page1RequestCounter).toBeGreaterThan(0);
			expect(page2RequestCounter).toBe(0);

			res();
		}, 3000));

		const page1RequestCount = page1RequestCounter;

		await page1.close();

		await new Promise<void>((res: () => void) => setTimeout(async() => {
			expect(page1RequestCount).toEqual(page1RequestCounter);
			expect(page2RequestCounter).toBeGreaterThan(0);

			res();
		}, 3000));
	}, 15000);
});

