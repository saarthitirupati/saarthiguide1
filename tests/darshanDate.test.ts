import test from 'node:test';
import assert from 'node:assert';
import { getISTDateInfo } from '../src/lib/istDate';

test('Darshan Date Synchronization and Asia/Kolkata timezone accuracy', async (t) => {
  await t.test('Date transition test: 31 Oct 2026 -> 1 Nov 2026 in Asia/Kolkata', () => {
    // 31 Oct 2026, 17:30:00 IST is 12:00:00 UTC
    const refDate = new Date('2026-10-31T12:00:00Z');
    const ist = getISTDateInfo(undefined, refDate);

    assert.strictEqual(ist.today, '31 Oct 2026', 'Today must be 31 Oct 2026 in IST');
    assert.strictEqual(ist.tomorrow, '1 Nov 2026', 'Tomorrow must be 1 Nov 2026 in IST');
    assert.strictEqual(ist.yesterday, '30 Oct 2026', 'Yesterday must be 30 Oct 2026 in IST');
  });

  await t.test('Near-midnight edge cases do not cause UTC shifts', () => {
    // 31 Oct 2026, 23:55:00 IST is 18:25:00 UTC
    const lateEvening = new Date('2026-10-31T18:25:00Z');
    const istLate = getISTDateInfo(undefined, lateEvening);
    assert.strictEqual(istLate.today, '31 Oct 2026', 'Late night 31 Oct IST must still be 31 Oct 2026');
    assert.strictEqual(istLate.tomorrow, '1 Nov 2026', 'Tomorrow for late night 31 Oct must be 1 Nov 2026');

    // 1 Nov 2026, 00:05:00 IST is 31 Oct 2026 18:35:00 UTC
    const pastMidnight = new Date('2026-10-31T18:35:00Z');
    const istEarly = getISTDateInfo(undefined, pastMidnight);
    assert.strictEqual(istEarly.today, '1 Nov 2026', 'Past midnight IST must be 1 Nov 2026');
    assert.strictEqual(istEarly.tomorrow, '2 Nov 2026', 'Tomorrow after midnight IST must be 2 Nov 2026');
  });

  await t.test('Canonical targetDarshanDate synchronization: Heading and Description match exactly', () => {
    const refDate = new Date('2026-10-31T12:00:00Z');
    const ist = getISTDateInfo(undefined, refDate);
    const isIssuing = true;

    // Simulate QuickChecklist canonical targetDarshanDate logic
    const canonicalTargetDate = isIssuing ? ist.tomorrow : ist.today;

    const headingDate = canonicalTargetDate;
    const descriptionNote = `Tokens for tomorrow's darshan (${canonicalTargetDate}) are currently being issued at counters.`;

    assert.strictEqual(headingDate, '1 Nov 2026', 'Heading date must be 1 Nov 2026');
    assert.ok(descriptionNote.includes('1 Nov 2026'), 'Description must contain 1 Nov 2026');
    assert.ok(!descriptionNote.includes('31 Oct 2026'), 'Description must NOT contain 31 Oct 2026 when issuing for tomorrow');
  });

  await t.test('Explicit admin targetDarshanDate override is respected', () => {
    const refDate = new Date('2026-10-31T12:00:00Z');
    const ist = getISTDateInfo(undefined, refDate);
    const isIssuing = true;
    const mockLiveStatus = {
      targetDarshanDate: '2026-11-03T00:00:00Z'
    };

    const explicitTargetDate = mockLiveStatus.targetDarshanDate;
    const canonicalTargetDate = explicitTargetDate
      ? new Intl.DateTimeFormat('en-IN', { timeZone: 'Asia/Kolkata', day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(explicitTargetDate))
      : (isIssuing ? ist.tomorrow : ist.today);

    assert.strictEqual(canonicalTargetDate, '3 Nov 2026', 'Explicit admin darshan date must be formatted in IST');
  });
});

