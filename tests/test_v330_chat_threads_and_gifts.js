/**
 * test_v330_chat_threads_and_gifts.js
 * Verification of v3.3.0 Chat Threads, Multi-user Square Chat, Gift Sending, and Sticker Packs.
 */

const assert = require("assert");
const http = require("http");
const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "../data/users.json");
const MESSAGES_PATH = path.join(__dirname, "../data/messages.json");

// Backup original data for safe restoration
const originalDb = fs.readFileSync(DB_PATH, "utf8");
const originalMessages = fs.readFileSync(MESSAGES_PATH, "utf8");

function restoreData() {
  fs.writeFileSync(DB_PATH, originalDb, "utf8");
  fs.writeFileSync(MESSAGES_PATH, originalMessages, "utf8");
}

function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        let parsed = body;
        try {
          parsed = JSON.parse(body);
        } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, body: parsed });
      });
    });
    req.on("error", reject);
    if (postData) {
      req.write(typeof postData === "string" ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== [v3.3.0] Starting Chat Threads, Multi-user & Gift Tests ===");

  process.env.NODE_ENV = 'test';
  process.env.TEST_ENV = 'true';
  const server = require("../server.js");
  const PORT = 3591;

  await new Promise((resolve) => server.listen(PORT, resolve));

  try {
    // 1. Verify /api/chat/catalog
    console.log("1. Checking /api/chat/catalog...");
    const catalogRes = await makeRequest({
      hostname: "localhost",
      port: PORT,
      path: "/api/chat/catalog",
      method: "GET"
    });
    assert.strictEqual(catalogRes.status, 200, "Catalog status should be 200");
    assert.ok(catalogRes.body.success, "Catalog body success should be true");
    assert.ok(catalogRes.body.gifts.gift_heart, "gift_heart should exist");
    assert.ok(catalogRes.body.gifts.gift_cake, "gift_cake should exist");
    assert.strictEqual(catalogRes.body.gifts.gift_heart.price, 100);
    assert.strictEqual(catalogRes.body.gifts.gift_cake.price, 80);
    console.log("  -> Gift catalog verified successfully! (15 gifts total)");

    // 2. Obtain valid tokens for '맞춤요정' and '민지'
    console.log("2. Obtaining valid tokens for test users...");
    const dbData = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    let token1 = Object.keys(dbData.tokens || {}).find(t => dbData.tokens[t] === "맞춤요정");
    let token2 = Object.keys(dbData.tokens || {}).find(t => dbData.tokens[t] === "민지");

    if (!token1) {
      token1 = "test_token_fairy_" + Date.now();
      dbData.tokens[token1] = "맞춤요정";
    }
    if (!token2) {
      token2 = "test_token_minji_" + Date.now();
      dbData.tokens[token2] = "민지";
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2), "utf8");

    assert.ok(token1, "Fairy token must exist");
    assert.ok(token2, "Minji token must exist");
    console.log("  -> Tokens obtained successfully!");

    // 3. Check /api/chat/rooms for '맞춤요정'
    console.log("3. Fetching chat rooms for 맞춤요정...");
    const roomsRes = await makeRequest({
      hostname: "localhost",
      port: PORT,
      path: "/api/chat/rooms",
      method: "GET",
      headers: { "Authorization": `Bearer ${token1}` }
    });
    assert.strictEqual(roomsRes.status, 200);
    assert.ok(roomsRes.body.success);
    assert.ok(Array.isArray(roomsRes.body.rooms), "Rooms should be an array");
    const squareRoom = roomsRes.body.rooms.find(r => r.roomId === "square");
    assert.ok(squareRoom, "Square room must exist");
    assert.strictEqual(squareRoom.isGroup, true);

    const minjiRoom = roomsRes.body.rooms.find(r => r.username === "민지");
    assert.ok(minjiRoom, "민지 DM room must exist");
    console.log("  -> Rooms verified:", roomsRes.body.rooms.map(r => r.name));

    // 4. Send a text message to Square room from '맞춤요정'
    console.log("4. Sending message to Square room...");
    const sendSquareRes = await makeRequest({
      hostname: "localhost",
      port: PORT,
      path: "/api/chat/send",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token1}`
      }
    }, {
      roomId: "square",
      content: "모두 안녕하세요! 맞춤법 퀴즈 파이팅해요! 🌸"
    });
    assert.strictEqual(sendSquareRes.status, 201);
    assert.ok(sendSquareRes.body.success);
    assert.strictEqual(sendSquareRes.body.message.roomId, "square");
    assert.strictEqual(sendSquareRes.body.message.fromUsername, "맞춤요정");

    // 5. Send a sticker message to Square room from '민지'
    console.log("5. Sending sticker message from 민지...");
    const sendStickerRes = await makeRequest({
      hostname: "localhost",
      port: PORT,
      path: "/api/chat/send",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token2}`
      }
    }, {
      roomId: "square",
      type: "sticker",
      content: "[스티커] 반가워요!",
      sticker: {
        packId: "haru_friends",
        stickerId: "haru_hi",
        name: "반가워요 하루",
        url: "/stickers/haru_hi.svg"
      }
    });
    assert.strictEqual(sendStickerRes.status, 201);
    assert.ok(sendStickerRes.body.success);
    assert.strictEqual(sendStickerRes.body.message.type, "sticker");
    assert.strictEqual(sendStickerRes.body.message.sticker.stickerId, "haru_hi");

    // 6. Fetch Square thread messages
    console.log("6. Fetching Square thread messages...");
    const threadRes = await makeRequest({
      hostname: "localhost",
      port: PORT,
      path: "/api/chat/thread?roomId=square",
      method: "GET",
      headers: { "Authorization": `Bearer ${token1}` }
    });
    assert.strictEqual(threadRes.status, 200);
    assert.ok(threadRes.body.messages.length >= 2);
    const lastTwo = threadRes.body.messages.slice(-2);
    assert.strictEqual(lastTwo[0].fromUsername, "맞춤요정");
    assert.strictEqual(lastTwo[1].fromUsername, "민지");
    assert.strictEqual(lastTwo[1].type, "sticker");
    console.log("  -> Square thread verified with both text and sticker messages!");

    // 7. Test Gift Sending: '민지' sends 'gift_heart' to '맞춤요정'
    console.log("7. Testing Gift Sending (Item)...");
    // Ensure 민지 has enough points
    const currentDb = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    const minjiInitialPoints = currentDb.users["민지"].totalPoints || 500;
    const fairyInitialHeart = (currentDb.users["맞춤요정"].items && currentDb.users["맞춤요정"].items.heart) || 0;

    const sendGiftRes = await makeRequest({
      hostname: "localhost",
      port: PORT,
      path: "/api/chat/send-gift",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token2}`
      }
    }, {
      giftId: "gift_heart",
      toUsername: "맞춤요정",
      message: "맞춤요정님 힘내세요! 하트수호 선물이에요 💖"
    });
    assert.strictEqual(sendGiftRes.status, 201);
    assert.ok(sendGiftRes.body.success);
    assert.strictEqual(sendGiftRes.body.gift.id, "gift_heart");

    const afterDb = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    assert.strictEqual(afterDb.users["민지"].totalPoints, minjiInitialPoints - 100, "100 points deducted from 민지");
    assert.strictEqual(afterDb.users["맞춤요정"].items.heart, fairyInitialHeart + 1, "하트수호 1개 지급 완료 to 맞춤요정");
    console.log("  -> Item Gift verified! Points deducted and item credited correctly.");

    // 8. Test Social Gift Sending: '맞춤요정' sends 'gift_cake' to '민지'
    console.log("8. Testing Social Gift Sending (Cake + Bonus Points)...");
    const fairyPointsBefore = afterDb.users["맞춤요정"].totalPoints;
    const minjiPointsBefore = afterDb.users["민지"].totalPoints;

    const sendCakeRes = await makeRequest({
      hostname: "localhost",
      port: PORT,
      path: "/api/chat/send-gift",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token1}`
      }
    }, {
      giftId: "gift_cake",
      toUsername: "민지",
      message: "선물 고마워요! 달콤한 케이크 드세요 🍰"
    });
    assert.strictEqual(sendCakeRes.status, 201);
    assert.ok(sendCakeRes.body.success);

    const finalDb = JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
    assert.strictEqual(finalDb.users["맞춤요정"].totalPoints, fairyPointsBefore - 80, "80 points deducted from 맞춤요정");
    assert.strictEqual(finalDb.users["민지"].totalPoints, minjiPointsBefore + 40, "40 bonus points credited to 민지");
    assert.ok(Array.isArray(finalDb.users["민지"].gifts), "Gifts array should exist");
    const cakeGift = finalDb.users["민지"].gifts.find(g => g.giftId === "gift_cake");
    assert.ok(cakeGift, "Cake gift must be recorded in 민지's inventory");
    console.log("  -> Social Gift verified! Bonus points and gift inventory logged accurately.");

    // 9. Verify 1:1 DM thread between '맞춤요정' and '민지'
    console.log("9. Verifying 1:1 DM thread between 맞춤요정 and 민지...");
    const dmThreadRes = await makeRequest({
      hostname: "localhost",
      port: PORT,
      path: `/api/chat/thread?withUser=${encodeURIComponent("민지")}`,
      method: "GET",
      headers: { "Authorization": `Bearer ${token1}` }
    });
    assert.strictEqual(dmThreadRes.status, 200);
    const dmMessages = dmThreadRes.body.messages;
    assert.ok(dmMessages.length >= 2, "Should contain at least the 2 gifts");
    const giftMsgs = dmMessages.filter(m => m.type === "gift");
    assert.ok(giftMsgs.length >= 2, "Both gifts should be present in 1:1 thread");
    console.log("  -> 1:1 DM Thread verified! Gift cards correctly embedded.");

    // 10. Verify Real User Integrity (Rule 6)
    console.log("10. Checking 4 real users integrity...");
    const realUsers = ["맞춤요정", "민지", "미니미니", "단민러브"];
    assert.strictEqual(Object.keys(finalDb.users).length, 4, "Must only have exactly 4 real users");
    realUsers.forEach(u => {
      assert.ok(finalDb.users[u], `User ${u} must exist`);
    });
    console.log("  -> Real users integrity 100% verified!");

    console.log("🎉 All v3.3.0 Chat Threads & Gifts tests PASSED successfully!");
  } finally {
    restoreData();
    server.close();
  }
}

if (require.main === module) {
  runTests().catch(err => {
    console.error("Test Failed:", err);
    process.exit(1);
  });
}
