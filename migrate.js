const db = require('./db');

const descriptions = {
  1: "A rich, sweet, and melt-in-the-mouth traditional Indian delicacy made with generous amounts of ghee, sugar, and gram flour.",
  2: "Decadent, moist chocolate cake layered with rich fudge frosting. Perfect for any celebration or a midnight craving.",
  3: "Classic moist red velvet cake topped with a generous swirl of tangy and sweet cream cheese frosting.",
  4: "Traditional German dessert featuring layers of chocolate sponge cake, whipped cream, and luscious cherries.",
  5: "Light and refreshing sponge cake layered with fresh pineapple chunks and smooth vanilla cream.",
  6: "Classic, crumbly cookies made with premium butter that simply melt in your mouth. Perfect with tea or coffee.",
  7: "Soft, spongy, and juicy milk-solid balls soaked in a delicate sugar syrup infused with rose water.",
  8: "A premium Indian sweet made from cashew nuts, sugar, and ghee, garnished with edible silver foil.",
  9: "Rich, sweet pastry made of layers of filo dough filled with chopped nuts and sweetened with syrup or honey.",
  10: "Freshly fried, pillowy soft doughnut glazed with a smooth and glossy sugary coating.",
  11: "Authentic French-style pastry featuring flaky, buttery layers with a beautifully crisp exterior and soft interior.",
  12: "A crisp buttery tart shell filled with rich custard and topped with a colorful array of fresh seasonal fruits.",
  13: "Creamy, smooth New York style cheesecake with a buttery graham cracker crust and a hint of vanilla.",
  14: "Moist, sweet bread loaded with ripe bananas and a touch of cinnamon, baked to golden perfection.",
  15: "Traditional rich fruit cake loaded with rum-soaked dry fruits and warm spices. A holiday classic!"
};

async function migrate() {
  try {
    // 1. Add description column if it doesn't exist
    await new Promise((resolve, reject) => {
      db.query("ALTER TABLE products ADD COLUMN description TEXT", (err, result) => {
        if (err) {
          // Ignore error if column already exists
          if (err.code === 'ER_DUP_FIELDNAME') {
            console.log("Column 'description' already exists.");
            resolve();
          } else {
            reject(err);
          }
        } else {
          console.log("Added 'description' column.");
          resolve();
        }
      });
    });

    // 2. Update each product with unique descriptions
    for (const [id, desc] of Object.entries(descriptions)) {
      await new Promise((resolve, reject) => {
        db.query("UPDATE products SET description = ? WHERE product_id = ?", [desc, id], (err, result) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
    console.log("Successfully seeded descriptions for all products.");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
