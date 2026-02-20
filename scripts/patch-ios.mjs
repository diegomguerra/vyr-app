#!/usr/bin/env node

/**
 * patch-ios.mjs
 * 
 * Restaura automaticamente as configurações do HealthKit no projeto iOS
 * após cada `npx cap sync ios` ou `npx cap add ios`.
 * 
 * Três camadas:
 *   1. Info.plist  — chaves de privacidade
 *   2. App.entitlements — capability HealthKit
 *   3. project.pbxproj — referência ao entitlements + SystemCapability
 * 
 * Uso:
 *   node scripts/patch-ios.mjs
 *   npm run patch:ios
 *   npm run sync:ios   (cap sync + patch)
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';

// ── Helpers ──────────────────────────────────────────────────────────

const green  = (t) => `\x1b[32m${t}\x1b[0m`;
const yellow = (t) => `\x1b[33m${t}\x1b[0m`;
const red    = (t) => `\x1b[31m${t}\x1b[0m`;
const bold   = (t) => `\x1b[1m${t}\x1b[0m`;

const log = {
  added:   (msg) => console.log(`  ${green('✔')} ${msg}`),
  skipped: (msg) => console.log(`  ${yellow('–')} ${msg} (já existe)`),
  error:   (msg) => console.error(`  ${red('✖')} ${msg}`),
};

const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');

// ── Paths ────────────────────────────────────────────────────────────

const PLIST_PATH        = resolve(ROOT, 'ios/App/App/Info.plist');
const ENTITLEMENTS_PATH = resolve(ROOT, 'ios/App/App/App.entitlements');
const PBXPROJ_PATH      = resolve(ROOT, 'ios/App/App.xcodeproj/project.pbxproj');

// ═════════════════════════════════════════════════════════════════════
// CAMADA 1 — Info.plist
// ═════════════════════════════════════════════════════════════════════

function patchInfoPlist() {
  console.log(bold('\n📋 Camada 1 — Info.plist'));

  if (!existsSync(PLIST_PATH)) {
    log.error(`Info.plist não encontrado em ${PLIST_PATH}`);
    log.error('Rode "npx cap add ios" primeiro.');
    return;
  }

  let plist = readFileSync(PLIST_PATH, 'utf-8');
  let changed = false;

  const keys = [
    {
      key: 'NSHealthShareUsageDescription',
      value: 'VYR precisa acessar seus dados de saúde para personalizar suas recomendações cognitivas.',
    },
    {
      key: 'NSHealthUpdateUsageDescription',
      value: 'VYR precisa registrar dados de saúde para acompanhar seu progresso.',
    },
  ];

  for (const { key, value } of keys) {
    if (plist.includes(`<key>${key}</key>`)) {
      log.skipped(key);
    } else {
      const snippet = `\t<key>${key}</key>\n\t<string>${value}</string>\n`;
      // Insere antes do último </dict>
      const idx = plist.lastIndexOf('</dict>');
      if (idx === -1) {
        log.error(`Não encontrei </dict> no Info.plist`);
        continue;
      }
      plist = plist.slice(0, idx) + snippet + plist.slice(idx);
      changed = true;
      log.added(key);
    }
  }

  if (changed) writeFileSync(PLIST_PATH, plist, 'utf-8');
}

// ═════════════════════════════════════════════════════════════════════
// CAMADA 2 — App.entitlements
// ═════════════════════════════════════════════════════════════════════

function patchEntitlements() {
  console.log(bold('\n🔑 Camada 2 — App.entitlements'));

  const entitlements = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
\t<key>com.apple.developer.healthkit</key>
\t<true/>
\t<key>com.apple.developer.healthkit.access</key>
\t<array>
\t\t<string>health-records</string>
\t</array>
</dict>
</plist>
`;

  const dir = dirname(ENTITLEMENTS_PATH);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

  if (existsSync(ENTITLEMENTS_PATH)) {
    const existing = readFileSync(ENTITLEMENTS_PATH, 'utf-8');
    if (existing.includes('com.apple.developer.healthkit')) {
      log.skipped('App.entitlements (HealthKit já presente)');
      return;
    }
  }

  writeFileSync(ENTITLEMENTS_PATH, entitlements, 'utf-8');
  log.added('App.entitlements criado com HealthKit');
}

// ═════════════════════════════════════════════════════════════════════
// CAMADA 3 — project.pbxproj
// ═════════════════════════════════════════════════════════════════════

function patchPbxproj() {
  console.log(bold('\n⚙️  Camada 3 — project.pbxproj'));

  if (!existsSync(PBXPROJ_PATH)) {
    log.error(`project.pbxproj não encontrado em ${PBXPROJ_PATH}`);
    return;
  }

  let pbx = readFileSync(PBXPROJ_PATH, 'utf-8');
  let changed = false;

  // ── 3a. CODE_SIGN_ENTITLEMENTS nos buildSettings ──

  const buildSettingsRegex = /buildSettings\s*=\s*\{[^}]*PRODUCT_NAME\s*=\s*App;[^}]*\}/g;
  let match;
  const insertions = [];

  buildSettingsRegex.lastIndex = 0;
  while ((match = buildSettingsRegex.exec(pbx)) !== null) {
    const block = match[0];
    if (block.includes('CODE_SIGN_ENTITLEMENTS')) {
      continue;
    }
    const insertPos = match.index + block.indexOf('{') + 1;
    insertions.push(insertPos);
  }

  if (insertions.length > 0) {
    const snippet = '\n\t\t\t\tCODE_SIGN_ENTITLEMENTS = App/App.entitlements;';
    let chars = pbx.split('');
    for (const pos of insertions.reverse()) {
      chars.splice(pos, 0, ...snippet.split(''));
    }
    pbx = chars.join('');
    changed = true;
    log.added(`CODE_SIGN_ENTITLEMENTS injetado em ${insertions.length} buildSettings`);
  } else {
    log.skipped('CODE_SIGN_ENTITLEMENTS');
  }

  // ── 3b. PBXFileReference para App.entitlements ──

  if (!pbx.includes('App.entitlements')) {
    const ENT_FILE_REF = 'A1B2C3D4E5F60001';
    const fileRefLine = `\t\t${ENT_FILE_REF} /* App.entitlements */ = {isa = PBXFileReference; lastKnownFileType = text.plist.entitlements; path = App.entitlements; sourceTree = "<group>"; };`;

    const fileRefMarker = '/* Begin PBXFileReference section */';
    const frIdx = pbx.indexOf(fileRefMarker);
    if (frIdx !== -1) {
      const insertAt = frIdx + fileRefMarker.length;
      pbx = pbx.slice(0, insertAt) + '\n' + fileRefLine + pbx.slice(insertAt);
      changed = true;
      log.added('PBXFileReference para App.entitlements');
    }

    const groupRegex = /children\s*=\s*\([^)]*Info\.plist[^)]*\)/;
    const groupMatch = pbx.match(groupRegex);
    if (groupMatch) {
      const groupBlock = groupMatch[0];
      const childEntry = `\n\t\t\t\t${ENT_FILE_REF} /* App.entitlements */,`;
      const parenIdx = groupBlock.indexOf('(');
      const newBlock = groupBlock.slice(0, parenIdx + 1) + childEntry + groupBlock.slice(parenIdx + 1);
      pbx = pbx.replace(groupBlock, newBlock);
      changed = true;
      log.added('App.entitlements adicionado ao PBXGroup');
    }
  } else {
    log.skipped('PBXFileReference App.entitlements');
  }

  // ── 3c. SystemCapabilities — HealthKit no TargetAttributes ──

  if (!pbx.includes('com.apple.HealthKit')) {
    const taMarker = 'TargetAttributes = {';
    const taIdx = pbx.indexOf(taMarker);
    if (taIdx !== -1) {
      const afterTa = pbx.slice(taIdx + taMarker.length);
      const targetBlockMatch = afterTa.match(/(\s*[A-F0-9]{24}\s*=\s*\{)/);
      if (targetBlockMatch) {
        const insertPos = taIdx + taMarker.length + targetBlockMatch.index + targetBlockMatch[0].length;
        const capSnippet = `
\t\t\t\t\t\tSystemCapabilities = {
\t\t\t\t\t\t\tcom.apple.HealthKit = {
\t\t\t\t\t\t\t\tenabled = 1;
\t\t\t\t\t\t\t};
\t\t\t\t\t\t};`;
        pbx = pbx.slice(0, insertPos) + capSnippet + pbx.slice(insertPos);
        changed = true;
        log.added('SystemCapabilities HealthKit');
      }
    } else {
      log.error('TargetAttributes não encontrado no pbxproj');
    }
  } else {
    log.skipped('SystemCapabilities HealthKit');
  }

  if (changed) writeFileSync(PBXPROJ_PATH, pbx, 'utf-8');
}

// ═════════════════════════════════════════════════════════════════════
// Main
// ═════════════════════════════════════════════════════════════════════

console.log(bold('🩺 patch-ios.mjs — Restaurando HealthKit no projeto iOS\n'));

patchInfoPlist();
patchEntitlements();
patchPbxproj();

console.log(bold('\n✅ Patch concluído!\n'));
console.log('Próximos passos:');
console.log('  1. Abra o Xcode: ios/App/App.xcodeproj');
console.log('  2. Configure o Team (Signing & Capabilities)');
console.log('  3. Build & Run ▶️\n');
