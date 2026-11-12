import { parseSlotTime, isSlotTimePassed } from '../components/common/ClockTimeSelector';

/**
 * Self-executing and test-runner compatible unit tests for:
 * 1. parseSlotTime(slotStr)
 * 2. isSlotTimePassed(selectedDate, slotStr)
 */

export function runClockTimeTests() {
  const results: { name: string; passed: boolean; error?: string }[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      results.push({ name, passed: true });
    } catch (err: any) {
      results.push({ name, passed: false, error: err?.message || String(err) });
    }
  }

  function assertEqual(actual: any, expected: any, desc?: string) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${desc ? desc + ': ' : ''}Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
    }
  }

  // --- Test Suite: parseSlotTime ---
  test('parseSlotTime: parses standard 12-hour AM slot', () => {
    const res = parseSlotTime('09:30 AM');
    assertEqual(res, { hour12: 9, minute: 30, isPm: false, label: '09:30 AM' });
  });

  test('parseSlotTime: parses standard 12-hour PM slot', () => {
    const res = parseSlotTime('04:15 PM');
    assertEqual(res, { hour12: 4, minute: 15, isPm: true, label: '04:15 PM' });
  });

  test('parseSlotTime: parses 24-hour afternoon slot without AM/PM', () => {
    const res = parseSlotTime('14:00');
    assertEqual(res, { hour12: 2, minute: 0, isPm: true, label: '02:00 PM' });
  });

  test('parseSlotTime: parses 24-hour morning slot without AM/PM', () => {
    const res = parseSlotTime('08:45');
    assertEqual(res, { hour12: 8, minute: 45, isPm: false, label: '08:45 AM' });
  });

  test('parseSlotTime: parses time range taking only first part', () => {
    const res = parseSlotTime('02:00 PM - 03:00 PM');
    assertEqual(res, { hour12: 2, minute: 0, isPm: true, label: '02:00 PM' });
  });

  test('parseSlotTime: noon edge case (12:00 PM)', () => {
    const res = parseSlotTime('12:00 PM');
    assertEqual(res, { hour12: 12, minute: 0, isPm: true, label: '12:00 PM' });
  });

  test('parseSlotTime: noon edge case in 24h (12:00)', () => {
    const res = parseSlotTime('12:00');
    assertEqual(res, { hour12: 12, minute: 0, isPm: true, label: '12:00 PM' });
  });

  test('parseSlotTime: midnight edge case in 12h (12:00 AM)', () => {
    const res = parseSlotTime('12:00 AM');
    assertEqual(res, { hour12: 12, minute: 0, isPm: false, label: '12:00 AM' });
  });

  test('parseSlotTime: midnight edge case in 24h (00:30)', () => {
    const res = parseSlotTime('00:30');
    assertEqual(res, { hour12: 12, minute: 30, isPm: false, label: '12:30 AM' });
  });

  test('parseSlotTime: invalid/empty input fallback to 9:00 AM', () => {
    assertEqual(parseSlotTime(''), { hour12: 9, minute: 0, isPm: false, label: '09:00 AM' });
    assertEqual(parseSlotTime('invalid-text'), { hour12: 9, minute: 0, isPm: false, label: '09:00 AM' });
  });

  // --- Test Suite: isSlotTimePassed ---
  test('isSlotTimePassed: past date returns true', () => {
    const pastDate = '2020-01-01';
    assertEqual(isSlotTimePassed(pastDate, '10:00 AM'), true);
    assertEqual(isSlotTimePassed(pastDate, '11:00 PM'), true);
  });

  test('isSlotTimePassed: future date returns false', () => {
    const futureDate = '2099-12-31';
    assertEqual(isSlotTimePassed(futureDate, '08:00 AM'), false);
    assertEqual(isSlotTimePassed(futureDate, '02:00 PM'), false);
  });

  test('isSlotTimePassed: today past time returns true', () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    // 00:01 AM today has definitely passed unless the test runs at midnight sharp
    if (now.getHours() > 0 || now.getMinutes() > 2) {
      assertEqual(isSlotTimePassed(today, '12:01 AM'), true);
    }
  });

  test('isSlotTimePassed: today far future time returns false', () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;

    // 11:59 PM today has not passed unless test runs at 23:59
    if (now.getHours() < 23 || now.getMinutes() < 58) {
      assertEqual(isSlotTimePassed(today, '11:59 PM'), false);
    }
  });

  return results;
}

// Self-runner check
declare const process: any;
if (typeof process !== 'undefined' && process?.env?.NODE_ENV !== 'production') {
  try {
    const res = runClockTimeTests();
    const failed = res.filter(r => !r.passed);
    if (failed.length > 0) {
      console.error(`ClockTimeSelector Unit Tests FAILED (${failed.length}/${res.length}):`);
      failed.forEach(f => console.error(`  - ✗ ${f.name}: ${f.error}`));
    } else {
      console.log(`ClockTimeSelector Unit Tests PASSED (${res.length}/${res.length} tests).`);
    }
  } catch (e) {
    console.error('Error running clock time tests:', e);
  }
}
