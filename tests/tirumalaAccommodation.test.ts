import test from 'node:test';
import assert from 'node:assert';
import { TIRUMALA_STAYS, GOOD_TO_KNOW_RULES, ACCOMMODATION_FAQS, TTD_HELPLINES } from '../src/data/tirumalaAccommodation';

test('Tirumala-Only Accommodation Dataset Integrity Tests', async (t) => {
  await t.test('All 24 accommodation locations are strictly within Tirumala hilltop coordinates', () => {
    assert.strictEqual(TIRUMALA_STAYS.length, 24, 'Dataset must contain exactly 24 verified Tirumala stays');

    for (const loc of TIRUMALA_STAYS) {
      // Tirumala hilltop latitude is approximately 13.67 to 13.69
      assert.ok(
        loc.coordinates.lat >= 13.670 && loc.coordinates.lat <= 13.695,
        `Location "${loc.name}" latitude (${loc.coordinates.lat}) is outside Tirumala boundaries!`
      );

      // Tirumala hilltop longitude is approximately 79.340 to 79.360
      assert.ok(
        loc.coordinates.lng >= 79.340 && loc.coordinates.lng <= 79.360,
        `Location "${loc.name}" longitude (${loc.coordinates.lng}) is outside Tirumala boundaries!`
      );
    }
  });

  await t.test('Zero downhill Tirupati locations exist in the dataset', () => {
    // Tirupati town is at latitude ~13.62 to 13.64 and longitude ~79.40 to 79.44
    for (const loc of TIRUMALA_STAYS) {
      const isDownhillLat = loc.coordinates.lat < 13.660;
      const isDownhillLng = loc.coordinates.lng > 79.390;

      assert.ok(!isDownhillLat, `Location "${loc.name}" has downhill latitude`);
      assert.ok(!isDownhillLng, `Location "${loc.name}" has downhill longitude`);

      const downhillTerms = ['srinivasam', 'vishnu nivasam', 'alipiri', 'madhavam', 'chittoor road', 'renigunta', 'railway station tirupati', 'rtc bus stand tirupati'];
      for (const term of downhillTerms) {
        assert.ok(
          !loc.name.toLowerCase().includes(term) && !loc.area.toLowerCase().includes(term),
          `Location "${loc.name}" illegally references downhill term "${term}"`
        );
      }
    }
  });

  await t.test('Every location has a valid Google Maps navigation URL and landmark', () => {
    for (const loc of TIRUMALA_STAYS) {
      assert.ok(loc.navigationUrl.startsWith('https://www.google.com/maps/'), `Missing valid maps URL for ${loc.name}`);
      assert.ok(loc.landmark.trim().length > 0, `Missing landmark for ${loc.name}`);
      assert.ok(loc.searchAliases.length > 0, `Missing search aliases for ${loc.name}`);
    }
  });

  await t.test('Category distribution matches verified counts', () => {
    const freePacs = TIRUMALA_STAYS.filter(l => l.category === 'free_pac');
    const allotmentCounters = TIRUMALA_STAYS.filter(l => l.category === 'allotment_counter');
    const subEnquiries = TIRUMALA_STAYS.filter(l => l.category === 'sub_enquiry');
    const restHousesMutts = TIRUMALA_STAYS.filter(l => l.category === 'rest_house_mutt');

    assert.strictEqual(freePacs.length, 5, 'Must have 5 Free PAC Halls (PAC 1-5)');
    assert.strictEqual(allotmentCounters.length, 3, 'Must have 3 Allotment Counters (CRO, ARP, MBC-26)');
    assert.strictEqual(subEnquiries.length, 7, 'Must have 7 Sub-Enquiry Offices');
    assert.strictEqual(restHousesMutts.length, 9, 'Must have 9 Rest Houses & Mutts');
  });

  await t.test('Good to know, FAQs, and Helplines are verified', () => {
    assert.ok(GOOD_TO_KNOW_RULES.length >= 4, 'Must have at least 4 Good to Know rules');
    assert.ok(ACCOMMODATION_FAQS.length >= 5, 'Must have at least 5 FAQs');
    assert.ok(TTD_HELPLINES.some(h => h.number === '155257'), 'Must include official TTD 155257 helpline');
  });
});

