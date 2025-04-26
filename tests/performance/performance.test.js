import { performance } from 'perf_hooks';

describe('Performance Tests', () => {
  beforeEach(() => {
    setupTestEnvironment();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const measureTime = async (fn) => {
    const start = performance.now();
    await fn();
    return performance.now() - start;
  };

  describe('Initialization Performance', () => {
    test('should initialize enhancer quickly', async () => {
      const initTime = await measureTime(() => {
        initEnhancer();
      });

      expect(initTime).toBeLessThan(100); // Should initialize in under 100ms
    });

    test('should initialize with complex configuration quickly', async () => {
      // Set up complex configuration
      const script = document.querySelector('#fw_script');
      script.setAttribute('data-include-tags', 'comedy,improv,standup,sketch,musical');
      script.setAttribute('data-exclude-tags', '18+,mature');
      script.setAttribute('data-tag-match', 'all');
      script.setAttribute('data-date-range', '2025-04-01,2025-04-30');
      script.setAttribute('data-days-of-week', '5,6');
      script.setAttribute('data-combined-view', 'true');
      script.setAttribute('data-show-filters', 'true');
      script.setAttribute('data-show-tags', 'true');

      const initTime = await measureTime(() => {
        initEnhancer();
      });

      expect(initTime).toBeLessThan(200); // Should initialize in under 200ms with complex config
    });
  });

  describe('Filter Operations Performance', () => {
    test('should apply filters efficiently', async () => {
      // Initialize with some events
      const events = Array.from({ length: 100 }, (_, i) => ({
        title: `Event ${i}`,
        start: new Date(2025, 3, 1 + Math.floor(i / 4)),
        tags: ['comedy', 'improv', 'standup'][i % 3],
        type: i % 2 === 0 ? 'shows' : 'classes'
      }));

      // Measure filter application time
      const filterTime = await measureTime(() => {
        applyFilters(events, {
          includeTags: ['comedy'],
          excludeTags: [],
          tagMatch: 'any',
          startDate: new Date(2025, 3, 1),
          endDate: new Date(2025, 3, 30),
          daysOfWeek: [5, 6],
          limit: 10
        });
      });

      expect(filterTime).toBeLessThan(50); // Should filter in under 50ms
    });

    test('should handle rapid filter changes efficiently', async () => {
      const filterChanges = [
        { type: 'includeTags', value: ['comedy'] },
        { type: 'daysOfWeek', value: [5, 6] },
        { type: 'limit', value: 5 },
        { type: 'tagMatch', value: 'all' },
        { type: 'includeTags', value: ['comedy', 'improv'] }
      ];

      const times = [];
      for (const change of filterChanges) {
        const time = await measureTime(() => {
          FWEnhancer.setFilter(change.type, change.value);
        });
        times.push(time);
        jest.advanceTimersByTime(100);
      }

      const averageTime = times.reduce((a, b) => a + b, 0) / times.length;
      expect(averageTime).toBeLessThan(20); // Each change should take under 20ms on average
    });
  });

  describe('DOM Updates Performance', () => {
    test('should update calendar view efficiently', async () => {
      // Set up calendar view
      document.body.innerHTML = `
        <div class="fw-embed fw-calendar">
          <div class="fc">
            ${Array.from({ length: 30 }, (_, i) => `
              <div class="fc-event" data-date="2025-04-${i + 1}">
                <div class="fc-event-title">Event ${i + 1}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      const updateTime = await measureTime(() => {
        enhanceCalendarView(
          document.querySelector('.fw-embed'),
          Array.from({ length: 10 }, (_, i) => ({
            title: `Event ${i + 1}`,
            start: `2025-04-${i + 1}`,
            tags: ['comedy']
          }))
        );
      });

      expect(updateTime).toBeLessThan(100); // Should update in under 100ms
    });

    test('should update card view efficiently', async () => {
      // Set up card view
      document.body.innerHTML = `
        <div class="fw-embed fw-cards">
          ${Array.from({ length: 30 }, (_, i) => `
            <a href="#" class="fw-card">
              <div class="card-title">Event ${i + 1}</div>
            </a>
          `).join('')}
        </div>
      `;

      const updateTime = await measureTime(() => {
        enhanceCardView(
          document.querySelector('.fw-embed'),
          Array.from({ length: 10 }, (_, i) => ({
            title: `Event ${i + 1}`,
            start: `2025-04-${i + 1}`,
            tags: ['comedy'],
            img: '/test.jpg',
            description: 'Test description',
            cost: { formatted: '$20' }
          }))
        );
      });

      expect(updateTime).toBeLessThan(150); // Should update in under 150ms
    });
  });

  describe('Memory Usage', () => {
    test('should maintain reasonable memory usage with many events', async () => {
      // Create large dataset
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        title: `Event ${i}`,
        start: new Date(2025, 3, 1 + Math.floor(i / 10)),
        tags: ['comedy', 'improv', 'standup', 'sketch', 'musical'][i % 5],
        type: i % 2 === 0 ? 'shows' : 'classes',
        description: 'Test description'.repeat(10),
        img: '/test.jpg',
        cost: { formatted: '$20' }
      }));

      const memoryBefore = process.memoryUsage().heapUsed;

      await measureTime(() => {
        applyFilters(largeDataset, {
          includeTags: ['comedy', 'improv'],
          tagMatch: 'any',
          startDate: new Date(2025, 3, 1),
          endDate: new Date(2025, 3, 30),
          daysOfWeek: [5, 6],
          limit: 50
        });
      });

      const memoryAfter = process.memoryUsage().heapUsed;
      const memoryIncrease = memoryAfter - memoryBefore;

      expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // Less than 50MB increase
    });

    test('should clean up resources properly', async () => {
      const memoryMeasurements = [];

      for (let i = 0; i < 10; i++) {
        setupTestEnvironment();
        const memoryBefore = process.memoryUsage().heapUsed;

        initEnhancer();
        FWEnhancer.setFilter('includeTags', ['comedy']);
        FWEnhancer.resetFilters();

        const memoryAfter = process.memoryUsage().heapUsed;
        memoryMeasurements.push(memoryAfter - memoryBefore);

        document.body.innerHTML = '';
      }

      const averageMemoryUse = memoryMeasurements.reduce((a, b) => a + b, 0) / memoryMeasurements.length;
      const memoryVariance = Math.max(...memoryMeasurements) - Math.min(...memoryMeasurements);

      expect(memoryVariance).toBeLessThan(averageMemoryUse * 0.2);
    });
  });

  describe('Network Performance', () => {
    test('should handle API responses efficiently', async () => {
      const processingTime = await measureTime(async () => {
        const response = await fetch('*/api/v1/shows');
        const data = await response.json();
        processApiData(data, 'shows');
      });

      expect(processingTime).toBeLessThan(50); // Should process API response in under 50ms
    });

    test('should batch API requests efficiently', async () => {
      const batchTime = await measureTime(async () => {
        await Promise.all([
          fetch('*/api/v1/shows'),
          fetch('*/api/v1/classes')
        ]);
      });

      expect(batchTime).toBeLessThan(150); // Should complete batch requests in under 150ms
    });
  });

  describe('UI Responsiveness', () => {
    test('should maintain smooth UI during filter operations', async () => {
      let longTaskCount = 0;
      const observer = new PerformanceObserver((list) => {
        longTaskCount += list.getEntries().length;
      });
      observer.observe({ entryTypes: ['longtask'] });

      for (let i = 0; i < 10; i++) {
        await measureTime(() => {
          FWEnhancer.setFilter('includeTags', [`tag${i}`]);
        });
        jest.advanceTimersByTime(50);
      }

      expect(longTaskCount).toBe(0);
      observer.disconnect();
    });

    test('should handle window resize efficiently', async () => {
      const resizeTime = await measureTime(() => {
        window.dispatchEvent(new Event('resize'));
      });

      expect(resizeTime).toBeLessThan(50); // Should handle resize in under 50ms
    });
  });
});
