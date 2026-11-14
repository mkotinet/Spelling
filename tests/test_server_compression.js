const assert = require("assert");
const http = require("http");
const zlib = require("zlib");
const path = require("path");

process.env.TEST_ENV = "true";
const serverPath = path.join(__dirname, "../server.js");
delete require.cache[require.resolve(serverPath)];
const server = require(serverPath);

const TEST_PORT = 8995;

console.log("Testing server static compression and cache headers...");

server.listen(TEST_PORT, () => {
  const req = http.request({
    hostname: "127.0.0.1",
    port: TEST_PORT,
    path: "/app.js?v=2.4.3",
    method: "GET",
    headers: {
      "Accept-Encoding": "gzip"
    }
  }, (res) => {
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.headers["content-encoding"], "gzip", "Server must serve gzipped content when Accept-Encoding: gzip");
    assert(res.headers["cache-control"].includes("immutable") || res.headers["cache-control"].includes("max-age"), "Versioned assets must have cache-control header");

    const chunks = [];
    res.on("data", chunk => chunks.push(chunk));
    res.on("end", () => {
      const buffer = Buffer.concat(chunks);
      const unzipped = zlib.gunzipSync(buffer).toString("utf-8");
      assert(unzipped.includes("HaruMatchumApp"), "Unzipped content must contain app.js code");
      console.log(`✅ Gzip compression working! Compressed: ${buffer.length} bytes, Uncompressed: ${Buffer.byteLength(unzipped)} bytes`);
      server.close(() => process.exit(0));
    });
  });

  req.on("error", (err) => {
    console.error("Test failed to connect:", err);
    server.close(() => process.exit(1));
  });

  req.end();
});
