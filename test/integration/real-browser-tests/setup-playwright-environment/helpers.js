import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.CI && !process.env.GITHUB_ACTIONS) {
  dotenv.config({
    path: path.resolve(__dirname, '../../../../.env'),
    quiet: true
  });
}

/**
 * Places an instantiated Reactor object on window.reactorSdk to use in tests.
 * @param page - Playwright page object
 * @param {boolean} silent - show startup messages or not
 * @returns {Promise<void>}
 */
export async function setupPlaywrightEnvironment({ page, silent = true }) {
  const config = {
    accessToken: process.env.RSDK_ACCESS_TOKEN,
    reactorUrl: process.env.RSDK_ADOBE_REACTOR_URL,
    orgId: process.env.RSDK_ADOBE_ORG_ID
  };

  if (
    !config?.accessToken?.length ||
    !config.reactorUrl?.length ||
    !config.orgId?.length
  ) {
    throw new Error(
      'Missing required configuration: accessToken, reactorUrl, orgId in process.env'
    );
  }

  // Capture browser logs for tests
  page.on('console', (msg) => console.log('[browser]', msg.text()));
  page.on('pageerror', (err) => console.error('[pageerror]', err));
  page.on('requestfailed', (req) =>
    console.error('[request failed]', req.url())
  );

  const htmlContent = fs.readFileSync(
    path.resolve(__dirname, './index.html'),
    'utf-8'
  );
  await page.setContent(htmlContent);

  if (!silent) {
    console.log('HTML template ready');
  }

  // 2️⃣ Load the SDK into the main world
  const sdkPath = path.resolve(
    __dirname,
    '../../../../dist/reactor-sdk.min.js'
  );
  const sdkCode = fs.readFileSync(sdkPath, 'utf8');

  await page.addScriptTag({ content: sdkCode });
  if (!silent) {
    console.log('SDK injected');
  }

  // 3️⃣ Wait until Reactor is available
  await page.waitForFunction(() => typeof window.Reactor !== 'undefined');
  if (!silent) {
    console.log('Reactor available');
  }

  await page.evaluate(({ accessToken, reactorUrl, orgId }) => {
    window.reactorSdk = new Reactor(accessToken, {
      reactorUrl: reactorUrl,
      customHeaders: { 'x-gw-ims-org-id': orgId }
    });
  }, config);
  if (!silent) {
    console.log('reactorSdk instance created on the window');
  }
}
