import assert from 'node:assert/strict';
import {
  attachTag,
  createLocalIdentityAdapter,
  createSovereignKernel,
  decoupleProjection,
  purgeLegacyStorage,
} from '../dist/index.js';

const blocked = attachTag(
  createSovereignKernel('User_2026'),
  { label: 'Like_mother_like_son', source: 'legacy', is_active: true }
);

assert.equal(blocked.attached, false);
assert.equal(blocked.kernel.tags.length, 0);
assert.equal(blocked.error?.code, 'permission_denied');

const installed = attachTag(
  createSovereignKernel('User_2026'),
  { label: 'Builds quietly', source: 'sovereign', is_active: true }
);

assert.equal(installed.attached, true);
assert.equal(installed.kernel.tags[0].label, 'Builds_quietly');

const imported = attachTag(
  { ...installed.kernel, firewall_enabled: false },
  { label: 'old family label', source: 'legacy', is_active: true }
);
assert.equal(purgeLegacyStorage(imported.kernel).tags.length, 1);

const shadow = decoupleProjection('Like_mother_like_son');
assert.equal(shadow.kind, 'shadow');
assert.equal(shadow.shadow_kind, 'legacy_projection');
assert.equal(shadow.affects_kernel, false);

const present = decoupleProjection('Today I notice my shoulders are tense');
assert.equal(present.kind, 'present_reality');
assert.ok(present.markers.includes('today'));

const spanishShadow = decoupleProjection('Eres demasiado, tú siempre haces esto');
assert.equal(spanishShadow.kind, 'shadow');
assert.equal(spanishShadow.shadow_kind, 'external_projection');
assert.equal(spanishShadow.affects_kernel, false);

const spanishPresent = decoupleProjection('Hoy observo tensión en mis hombros');
assert.equal(spanishPresent.kind, 'present_reality');
assert.ok(spanishPresent.markers.includes('hoy'));

const adapter = createLocalIdentityAdapter();
assert.equal((await adapter.decouple('you always do this')).kind, 'shadow');
