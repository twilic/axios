import { test } from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import { TWILIC_CONTENT_TYPE, createTwilicAxios } from "../dist/index.js";
import { createEchoServer } from "./helpers.mjs";

test("createTwilicAxios round-trip with @twilic/core wire bytes", async () => {
  const server = await createEchoServer();
  const client = createTwilicAxios(axios.create({ baseURL: server.baseUrl }));
  try {
    const payload = {
      id: 42n,
      name: "alice",
      active: true,
      tags: ["a", "b"],
    };

    const { data, status, headers } = await client.post("/echo", null, {
      twilicBody: payload,
    });

    assert.equal(status, 200);
    assert.equal(headers["content-type"], TWILIC_CONTENT_TYPE);
    assert.equal(data.id, 42n);
    assert.equal(data.name, "alice");
    assert.equal(data.active, true);
    assert.deepEqual(data.tags, ["a", "b"]);
  } finally {
    await server.close();
  }
});
