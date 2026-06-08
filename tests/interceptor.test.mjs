import { test } from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import {
  TWILIC_CONTENT_TYPE,
  createTwilicAxios,
  twilicRequestInterceptor,
  twilicResponseInterceptor,
} from "../dist/index.js";
import {
  createEchoServer,
  createJsonCodec,
  createTrackingCodec,
} from "./helpers.mjs";

test("twilicRequestInterceptor encodes twilicBody and sets content-type", () => {
  const codec = createJsonCodec();
  const interceptor = twilicRequestInterceptor(codec);
  const config = interceptor({
    headers: new axios.AxiosHeaders(),
    twilicBody: { id: 1 },
  });

  assert.equal(config.headers.get("Content-Type"), TWILIC_CONTENT_TYPE);
  assert.equal(config.responseType, "arraybuffer");
  assert.ok(Buffer.isBuffer(config.data));
});

test("twilicResponseInterceptor decodes Twilic responses only", () => {
  const codec = createJsonCodec();
  const interceptor = twilicResponseInterceptor(codec);
  const encoded = Buffer.from(codec.encode({ ok: true }));

  const twilicResponse = interceptor({
    data: encoded.buffer.slice(
      encoded.byteOffset,
      encoded.byteOffset + encoded.byteLength,
    ),
    headers: { "content-type": TWILIC_CONTENT_TYPE },
    status: 200,
    statusText: "OK",
    config: { headers: new axios.AxiosHeaders() },
  });

  assert.deepEqual(twilicResponse.data, { ok: true });

  const jsonResponse = interceptor({
    data: JSON.stringify({ passthrough: true }),
    headers: { "content-type": "application/json" },
    status: 200,
    statusText: "OK",
    config: { headers: new axios.AxiosHeaders() },
  });

  assert.equal(jsonResponse.data, JSON.stringify({ passthrough: true }));
});

test("createTwilicAxios round-trips through echo server", async () => {
  const server = await createEchoServer();
  const client = createTwilicAxios(axios.create({ baseURL: server.baseUrl }));
  try {
    const payload = { id: 42n, active: true, tags: ["a", "b"] };
    const { data, status, headers } = await client.post("/echo", null, {
      twilicBody: payload,
    });

    assert.equal(status, 200);
    assert.equal(headers["content-type"], TWILIC_CONTENT_TYPE);
    assert.equal(data.id, 42n);
    assert.equal(data.active, true);
    assert.deepEqual(data.tags, ["a", "b"]);
  } finally {
    await server.close();
  }
});

test("createTwilicAxios leaves non-twilic responses untouched", async () => {
  const server = await createEchoServer();
  const client = createTwilicAxios(axios.create({ baseURL: server.baseUrl }));
  try {
    const { data, headers } = await client.get("/json", {
      responseType: "json",
      twilicResponse: false,
    });

    assert.equal(headers["content-type"], "application/json");
    assert.deepEqual(data, { ok: true });
  } finally {
    await server.close();
  }
});

test("createTwilicAxios uses injected codec", async () => {
  const codec = createTrackingCodec();
  const server = await createEchoServer();
  const client = createTwilicAxios(
    axios.create({ baseURL: server.baseUrl }),
    codec,
  );
  try {
    await client.post("/echo", null, { twilicBody: { tracked: true } });
    assert.equal(codec.stats.encodeCalls, 1);
    assert.equal(codec.stats.decodeCalls, 1);
  } finally {
    await server.close();
  }
});
