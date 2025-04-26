const puppeteer = require('puppeteer');

describe('Configurator E2E Tests', () => {
  let browser;
  let page;
  const TEST_TIMEOUT = 30000; // 30 seconds

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }, TEST_TIMEOUT);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.setDefaultTimeout(TEST_TIMEOUT);
    await page.setDefaultNavigationTimeout(TEST_TIMEOUT);
    try {
      await page.goto('http://localhost:3000/configurator/index.html', {
        waitUntil: 'networkidle0'
      });
    } catch (error) {
      console.error('Failed to load configurator page. Make sure the local server is running on port 3000.');
      throw error;
    }
  }, TEST_TIMEOUT);

  afterEach(async () => {
    if (page) {
      await page.close();
    }
  });

  describe('Basic Configuration', () => {
    test('should generate basic embed code', async () => {
      // Fill in theatre name
      await page.type('#theatre', 'test-theatre');

      // Select show type
      await page.select('#eventType', 'shows');

      // Select calendar view
      await page.select('#viewType', 'calendar');

      // Generate code
      await page.click('#generate-code');

      // Get generated code
      const generatedCode = await page.$eval('.code-output', el => el.textContent);

      // Verify basic configuration
      expect(generatedCode).toContain('data-theatre="test-theatre"');
      expect(generatedCode).toContain('data-type="shows"');
      expect(generatedCode).toContain('data-view="calendar"');
    });

    test('should handle combined view configuration', async () => {
      // Fill in theatre name
      await page.type('#theatre', 'test-theatre');

      // Enable combined view
      await page.click('#combinedView');

      // Generate code
      await page.click('#generate-code');

      // Get generated code
      const generatedCode = await page.$eval('.code-output', el => el.textContent);

      // Verify combined view configuration
      expect(generatedCode).toContain('data-combined-view="true"');
    });

    test('should handle development mode', async () => {
      // Fill in theatre name
      await page.type('#theatre', 'test-theatre');

      // Enable development mode
      await page.click('#developmentMode');

      // Generate code
      await page.click('#generate-code');

      // Get generated code
      const generatedCode = await page.$eval('.code-output', el => el.textContent);

      // Verify development mode configuration
      expect(generatedCode).toContain('data-development="true"');
    });
  });

  describe('Advanced Filtering Configuration', () => {
    test('should configure tag filters', async () => {
      // Fill in theatre name
      await page.type('#theatre', 'test-theatre');

      // Add include tags
      await page.type('#includeTag', 'comedy');
      await page.click('#addIncludeTag');
      await page.type('#includeTag', 'improv');
      await page.click('#addIncludeTag');

      // Set tag match mode
      await page.select('#tagMatch', 'all');

      // Generate code
      await page.click('#generate-code');

      // Get generated code
      const generatedCode = await page.$eval('.code-output', el => el.textContent);

      // Verify tag configuration
      expect(generatedCode).toContain('data-include-tags="comedy,improv"');
      expect(generatedCode).toContain('data-tag-match="all"');
    });

    test('should configure date filters', async () => {
      // Fill in theatre name
      await page.type('#theatre', 'test-theatre');

      // Set date range
      await page.evaluate(() => {
        document.querySelector('#startDate').value = '2025-04-01';
        document.querySelector('#endDate').value = '2025-04-30';
      });

      // Generate code
      await page.click('#generate-code');

      // Get generated code
      const generatedCode = await page.$eval('.code-output', el => el.textContent);

      // Verify date configuration
      expect(generatedCode).toContain('data-date-range="2025-04-01,2025-04-30"');
    });

    test('should configure days of week filter', async () => {
      // Fill in theatre name
      await page.type('#theatre', 'test-theatre');

      // Select weekend days
      await page.evaluate(() => {
        document.querySelectorAll('input[name="day-of-week"]').forEach(checkbox => {
          if (['5', '6'].includes(checkbox.value)) {
            checkbox.checked = true;
          }
        });
      });

      // Generate code
      await page.click('#generate-code');

      // Get generated code
      const generatedCode = await page.$eval('.code-output', el => el.textContent);

      // Verify days of week configuration
      expect(generatedCode).toContain('data-days-of-week="5,6"');
    });
  });

  describe('Preview Functionality', () => {
    test('should load preview iframe', async () => {
      // Fill in theatre name
      await page.type('#theatre', 'test-theatre');

      // Click preview button
      await page.click('#preview-embed');

      // Wait for preview iframe to load
      await page.waitForSelector('.preview-frame iframe');

      // Verify iframe src
      const iframeSrc = await page.$eval('.preview-frame iframe', iframe => iframe.src);
      expect(iframeSrc).toContain('test-theatre');
    });

    test('should update preview when configuration changes', async () => {
      // Fill in initial configuration
      await page.type('#theatre', 'test-theatre');
      await page.click('#preview-embed');

      // Get initial iframe src
      const initialSrc = await page.$eval('.preview-frame iframe', iframe => iframe.src);

      // Change configuration
      await page.click('#combinedView');
      await page.click('#preview-embed');

      // Wait for preview to update
      await page.waitForTimeout(1000);

      // Get updated iframe src
      const updatedSrc = await page.$eval('.preview-frame iframe', iframe => iframe.src);

      // Verify preview updated
      expect(updatedSrc).not.toBe(initialSrc);
      expect(updatedSrc).toContain('data-combined-view=true');
    });
  });

  describe('Code Generation', () => {
    test('should generate valid HTML', async () => {
      // Configure all options
      await page.type('#theatre', 'test-theatre');
      await page.select('#eventType', 'shows');
      await page.select('#viewType', 'calendar');
      await page.click('#combinedView');
      await page.click('#showFilterControls');
      await page.click('#showTags');

      // Add tags
      await page.type('#includeTag', 'comedy');
      await page.click('#addIncludeTag');

      // Set date range
      await page.evaluate(() => {
        document.querySelector('#startDate').value = '2025-04-01';
        document.querySelector('#endDate').value = '2025-04-30';
      });

      // Generate code
      await page.click('#generate-code');

      // Get generated code
      const generatedCode = await page.$eval('.code-output', el => el.textContent);

      // Verify HTML structure
      expect(generatedCode).toMatch(/<script[^>]*>/);
      expect(generatedCode).toMatch(/<\/script>/);
      expect(generatedCode).toContain('id="fw_script"');
      expect(generatedCode).toContain('src="https://crowdwork.com/embed.js');
    });

    test('should copy code to clipboard', async () => {
      // Fill in basic config
      await page.type('#theatre', 'test-theatre');

      // Generate and copy code
      await page.click('#generate-code');
      await page.click('#copy-code');

      // Verify copy feedback
      const copyButton = await page.$('#copy-code');
      const buttonText = await page.evaluate(button => button.textContent, copyButton);
      expect(buttonText).toContain('Copied!');
    });
  });

  describe('Error Handling', () => {
    test('should validate required fields', async () => {
      // Try to generate code without theatre name
      await page.click('#generate-code');

      // Check for error message
      const errorMessage = await page.$eval('.error-message', el => el.textContent);
      expect(errorMessage).toContain('Theatre name is required');
    });

    test('should handle invalid date ranges', async () => {
      // Fill in theatre name
      await page.type('#theatre', 'test-theatre');

      // Set invalid date range (end before start)
      await page.evaluate(() => {
        document.querySelector('#startDate').value = '2025-04-30';
        document.querySelector('#endDate').value = '2025-04-01';
      });

      // Generate code
      await page.click('#generate-code');

      // Check for error message
      const errorMessage = await page.$eval('.error-message', el => el.textContent);
      expect(errorMessage).toContain('End date must be after start date');
    });
  });

  describe('Performance', () => {
    test('should load configurator page quickly', async () => {
      const startTime = Date.now();
      await page.goto('http://localhost:3000/configurator/index.html');
      const loadTime = Date.now() - startTime;

      expect(loadTime).toBeLessThan(3000); // Should load in under 3 seconds
    });

    test('should generate code efficiently', async () => {
      // Fill in complex configuration
      await page.type('#theatre', 'test-theatre');
      await page.click('#combinedView');
      await page.click('#showFilterControls');
      await page.click('#showTags');

      // Add multiple tags
      for (const tag of ['comedy', 'improv', 'standup', 'sketch', 'musical']) {
        await page.type('#includeTag', tag);
        await page.click('#addIncludeTag');
      }

      // Measure code generation time
      const startTime = Date.now();
      await page.click('#generate-code');
      const generationTime = Date.now() - startTime;

      expect(generationTime).toBeLessThan(1000); // Should generate in under 1 second
    });
  });
});
