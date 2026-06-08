import { test } from "node:test";
import assert from "node:assert/strict";
import {
  TWILIC_CONTENT_TYPE,
  createTwilicAxios,
  twilicRequestInterceptor,
  twilicResponseInterceptor,
} from "../dist/index.js";

test("TWILIC_CONTENT_TYPE is application/vnd.twilic", () => {
  assert.equal(TWILIC_CONTENT_TYPE, "application/vnd.twilic");
});

test("named exports are functions", () => {
  assert.equal(typeof createTwilicAxios, "function");
  assert.equal(typeof twilicRequestInterceptor, "function");
  assert.equal(typeof twilicResponseInterceptor, "function");
});
