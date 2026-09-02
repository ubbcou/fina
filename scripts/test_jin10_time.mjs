import assert from 'node:assert/strict';
import { parseJin10Time } from '../src/lib/api/jin10.ts';

assert.equal(
  parseJin10Time('2026-09-02 12:42:09'),
  Date.parse('2026-09-02T12:42:09+08:00') / 1000,
);

console.log('Jin10 timezone check passed.');
