const { connectDB, getDB, saveDB } = require("./database/db");

(async () => {
  await connectDB();

  const db = getDB();

  try {
    db.run("ALTER TABLE users ADD COLUMN uid TEXT");
    console.log("✓ تمت إضافة عمود uid");
  } catch (e) {
    console.log("ℹ️ العمود uid موجود بالفعل أو لا يمكن إضافته:", e.message);
  }

  const result = db.exec("SELECT id, uid FROM users");

  if (result.length) {
    for (const row of result[0].values) {
      const id = row[0];
      const uid = row[1];

      if (!uid) {
        const newUid = String(
          Math.floor(1000000000 + Math.random() * 9000000000)
        );

        db.run(
          "UPDATE users SET uid=? WHERE id=?",
          [newUid, id]
        );

        console.log(`User ${id} -> UID ${newUid}`);
      }
    }
  }

  saveDB();
  console.log("✅ انتهت ترقية قاعدة البيانات.");
})();
