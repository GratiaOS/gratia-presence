#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { defaultLocale, locales } from '../i18n/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function syncNamespace(namespace, baseLocale = defaultLocale) {
  const basePath = path.join(__dirname, '..', 'locales', baseLocale, `${namespace}.json`);
  if (!fs.existsSync(basePath)) {
    console.error(`Base file not found: ${basePath}`);
    process.exit(1);
  }
  const baseJson = readJson(basePath);

  locales
    .filter((loc) => loc !== baseLocale)
    .forEach((locale) => {
      const targetPath = path.join(__dirname, '..', 'locales', locale, `${namespace}.json`);
      const targetJson = readJson(targetPath);
      let changed = false;

      const walk = (base, target) => {
        Object.entries(base).forEach(([key, value]) => {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            if (!target[key]) target[key] = {};
            walk(value, target[key]);
          } else if (target[key] === undefined) {
            target[key] = `[MISSING ${locale}] ${value}`;
            changed = true;
            console.log(`➕ ${locale} :: ${namespace} :: ${key}`);
          }
        });
      };

      walk(baseJson, targetJson);
      if (changed) {
        writeJson(targetPath, targetJson);
        console.log(`✅ Synced ${locale}/${namespace}.json`);
      } else {
        console.log(`👌 No changes for ${locale}/${namespace}.json`);
      }
    });
}

function main() {
  const namespace = process.argv[2];
  const baseLocale = process.argv[3] || defaultLocale;
  if (!namespace) {
    console.error('Usage: i18n-sync <namespace> [baseLocale]');
    process.exit(1);
  }
  if (!locales.includes(baseLocale)) {
    console.error(`Unknown base locale: ${baseLocale}`);
    process.exit(1);
  }
  syncNamespace(namespace, baseLocale);
}

main();
