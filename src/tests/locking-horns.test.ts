import { describe, expect, it } from '@jest/globals';
import puppeteer from 'puppeteer';
import { openLocalPage } from './utils';

describe('Locking horns', () => {
	it('Shared data between tabs', async() => {
		const browser = await puppeteer.launch();
		const page1 = await browser.newPage();

		await page1.goto(openLocalPage());

		await expect(page1.title()).resolves.toMatch('Locking Horns');
	});
});

