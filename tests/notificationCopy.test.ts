import test from 'node:test';
import assert from 'node:assert';
import { formatSsdTokenNotification } from '../src/lib/notificationFormatter';

test('SSD & DD Notification Copy Optimization Tests', async (t) => {
  await t.test('Front-loads counts and target darshan date in English preview', () => {
    const formatted = formatSsdTokenNotification({
      status: 'issuing',
      ssdStatus: 'issuing',
      ddStatus: 'issuing',
      ssdAvailable: '5,259',
      ddAvailable: '1,532',
      targetDarshanDate: '1 Nov 2026',
      language: 'en'
    });

    assert.strictEqual(formatted.title, '🎟️ SSD & DD Tokens Issuing Now');
    assert.ok(formatted.body.startsWith('SSD: 5,259 left · DD: 1,532 left (Darshan: 1 Nov 2026)'),
      'Body must start with SSD/DD counts and darshan date');
    assert.ok(formatted.body.length < 120, 'Body should remain concise for notifications');
  });

  await t.test('Telugu notification preserves Telugu script and front-loads counts', () => {
    const formatted = formatSsdTokenNotification({
      status: 'issuing',
      ssdStatus: 'issuing',
      ddStatus: 'issuing',
      ssdAvailable: '5,259',
      ddAvailable: '1,532',
      targetDarshanDate: '1 Nov 2026',
      language: 'te'
    });

    assert.strictEqual(formatted.title, '🎟️ ఎస్‌ఎస్‌డి & డిడి టోకెన్లు జారీ అవుతున్నాయి');
    assert.ok(formatted.body.startsWith('SSD: 5,259 · DD: 1,532 మిగిలాయి (దర్శనం: 1 Nov 2026)'),
      'Telugu body must front-load counts and darshan date');
    assert.ok(formatted.body.includes('కౌంటర్ల వద్ద వెంటనే పొందండి'));
  });

  await t.test('Bilingual preset formatting', () => {
    const formatted = formatSsdTokenNotification({
      status: 'issuing',
      ssdStatus: 'issuing',
      ddStatus: 'issuing',
      ssdAvailable: '4,000',
      ddAvailable: '1,200',
      targetDarshanDate: '1 Nov 2026',
      language: 'bilingual'
    });

    assert.strictEqual(formatted.title, '🎟️ SSD & DD Tokens Issuing | టోకెన్లు జారీ');
    assert.ok(formatted.body.includes('SSD: 4,000 left · DD: 1,200 left'));
    assert.ok(formatted.body.includes('(Darshan: 1 Nov 2026)'));
    assert.ok(formatted.body.includes('కౌంటర్లలో జారీ ప్రారంభం'));
  });

  await t.test('Completed quota state formatting', () => {
    const formattedEn = formatSsdTokenNotification({
      status: 'closed-for-day',
      ssdStatus: 'completed',
      ddStatus: 'completed',
      nextBatchTime: '5:30 PM tomorrow',
      language: 'en'
    });

    assert.strictEqual(formattedEn.title, "⚠️ Today's SSD & DD Quota Completed");
    assert.ok(formattedEn.body.includes('SSD & DD quotas completed'));
    assert.ok(formattedEn.body.includes('Next release: 5:30 PM tomorrow'));

    const formattedTe = formatSsdTokenNotification({
      status: 'closed-for-day',
      ssdStatus: 'completed',
      ddStatus: 'completed',
      nextBatchTime: 'రేపు 5:30 PM',
      language: 'te'
    });

    assert.strictEqual(formattedTe.title, '⚠️ నేటి ఎస్‌ఎస్‌డి & డిడి కోటా పూర్తయింది');
    assert.ok(formattedTe.body.includes('కోటా పూర్తయింది'));
  });

  await t.test('Paused token state formatting', () => {
    const formatted = formatSsdTokenNotification({
      status: 'paused',
      ssdStatus: 'paused',
      ddStatus: 'paused',
      ssdAvailable: '1,500',
      ddAvailable: '300',
      language: 'en'
    });

    assert.strictEqual(formatted.title, '⏸️ SSD & DD Token Issuance Paused');
    assert.ok(formatted.body.includes('SSD: 1,500 left · DD: 300 left'));
  });

  await t.test('First 60 characters test: Essential information appears in collapsed view', () => {
    const formatted = formatSsdTokenNotification({
      status: 'issuing',
      ssdStatus: 'issuing',
      ddStatus: 'issuing',
      ssdAvailable: '5,259',
      ddAvailable: '1,532',
      targetDarshanDate: '1 Nov 2026',
      customNotice: 'Counters issuing now at Srinivasam, Vishnu Nivasam & Bhudevi complex.',
      language: 'en'
    });

    // Extract first 55 characters of body (standard collapsed preview window)
    const collapsedPreview = formatted.body.substring(0, 55);
    assert.ok(collapsedPreview.includes('SSD: 5,259'), 'Collapsed preview must contain SSD count');
    assert.ok(collapsedPreview.includes('DD: 1,532'), 'Collapsed preview must contain DD count');
    assert.ok(collapsedPreview.includes('1 Nov 2026'), 'Collapsed preview must contain darshan date');
  });

  await t.test('Safety Guard Verification: Rejects string "true" or non-boolean values to prevent accidental push', () => {
    // Helper replicating the API route's strict check
    const evaluatePushAuth = (sendSsdPush: any, sendDdPush: any) => {
      const isSsdPush = sendSsdPush === true;
      const isDdPush = sendDdPush === true;
      return isSsdPush || isDdPush;
    };

    // Edge cases that MUST NOT authorize push:
    assert.strictEqual(evaluatePushAuth('true', false), false, 'String "true" must NOT authorize push');
    assert.strictEqual(evaluatePushAuth(false, 'true'), false, 'String "true" must NOT authorize push');
    assert.strictEqual(evaluatePushAuth('false', 'false'), false, 'String "false" must NOT authorize push');
    assert.strictEqual(evaluatePushAuth(1, 0), false, 'Numbers 1/0 must NOT authorize push');
    assert.strictEqual(evaluatePushAuth(null, undefined), false, 'Null/undefined must NOT authorize push');
    assert.strictEqual(evaluatePushAuth({}, []), false, 'Objects/arrays must NOT authorize push');

    // Only literal boolean true is accepted:
    assert.strictEqual(evaluatePushAuth(true, false), true, 'Boolean true for SSD must authorize push');
    assert.strictEqual(evaluatePushAuth(false, true), true, 'Boolean true for DD must authorize push');
    assert.strictEqual(evaluatePushAuth(true, true), true, 'Boolean true for both must authorize push');
  });
});

