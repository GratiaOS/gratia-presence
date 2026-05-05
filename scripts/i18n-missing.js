#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defaultLocale, locales, namespaces } from '../i18n/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function flatten(prefix, obj, acc) {
  Object.entries(obj).forEach(([key, value]) => {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      flatten(full, value, acc);
    } else {
      acc.push(full);
    }
  });
}

function main() {
  namespaces.forEach((ns) => {
    const basePath = path.join(__dirname, '..', 'locales', defaultLocale, `${ns}.json`);
    if (!fs.existsSync(basePath)) return;
    const baseJson = readJson(basePath);
    const baseKeys = [];
    flatten('', baseJson, baseKeys);

    console.log(`\n=== Namespace: ${ns} ===`);
    locales.forEach((loc) => {
      if (loc === defaultLocale) return;
      const targetPath = path.join(__dirname, '..', 'locales', loc, `${ns}.json`);
      const targetJson = readJson(targetPath);
      const targetKeys = [];
      flatten('', targetJson, targetKeys);

      const missing = baseKeys.filter((k) => !targetKeys.includes(k));
      if (missing.length === 0) {
        console.log(`  ${loc}: ✅ all keys present`);
      } else {
        console.log(`  ${loc}: ❌ missing keys:`);
        missing.forEach((k) => console.log(`    - ${k}`));
      }
    });
  });
}

main();
