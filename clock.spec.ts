import { test, expect } from '@playwright/test';

const probe = () => {
  const d = Object.getOwnPropertyDescriptor(Intl.DateTimeFormat.prototype, 'format');
  let callResult: string;
  try {
    callResult = 'ok: ' + typeof d!.get!.call(new Intl.DateTimeFormat());
  } catch (e) {
    callResult = 'throws: ' + (e as Error).message;
  }
  return { hasGetter: typeof d?.get, isOwnAccessor: !!d && 'get' in d, callResult };
};

test('Intl.DateTimeFormat.prototype.format getter survives clock.install()', async ({ page }) => {
  await page.goto('about:blank');
  const before = await page.evaluate(probe);
  console.log('before install:', JSON.stringify(before));
  await page.clock.install({ time: new Date('2026-01-01T00:00:00Z') });
  await page.goto('about:blank');
  const after = await page.evaluate(probe);
  console.log('after install: ', JSON.stringify(after));
  expect(after).toEqual(before);
});
