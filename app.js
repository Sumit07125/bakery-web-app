const { render } = require("ejs");
const db = require("./db");
const express = require("express");
const app = express();
const session = require("express-session");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
    },
  })
);

const port = 3000;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

app.set("view engine", "ejs");

const isAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  res.redirect('/admin_login');
};

app.get("/", (req, res) => {
  let cartCount = 0;
  if (req.session.user) {
    const sql = "SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?";
    db.query(sql, [req.session.user.id], (err, result) => {
      if (err) throw err;
      cartCount = result[0] ? result[0].count || 0 : 0;
      db.query("SELECT * FROM products ORDER BY RAND()", (err, products) => {
        if (err) throw err;
        res.render("main", { products, user: req.session.user, cartCount });
      });
    });
  } else {
    db.query("SELECT * FROM products ORDER BY RAND()", (err, products) => {
      if (err) throw err;
      res.render("main", { products, user: req.session.user, cartCount });
    });
  }
});

app.get("/search", (req, res) => {
  const query = req.query.query;
  let cartCount = 0;
  if (req.session.user) {
    const sql = "SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?";
    db.query(sql, [req.session.user.id], (err, result) => {
      if (err) throw err;
      cartCount = result[0] ? result[0].count || 0 : 0;
      const sql = "SELECT * FROM products WHERE product_name LIKE ?";
      db.query(sql, [`%${query}%`], (err, products) => {
        if (err) throw err;
        res.render("main", { products, user: req.session.user, cartCount });
      });
    });
  } else {
    const sql = "SELECT * FROM products WHERE product_name LIKE ?";
    db.query(sql, [`%${query}%`], (err, products) => {
      if (err) throw err;
      res.render("main", { products, user: req.session.user, cartCount });
    });
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  const { name, address, age, phone_number, email, passward } = req.body;

  const sql = `INSERT INTO users (name,address,age,phone_number,email,passward) VALUES (?,?,?,?,?,?)`;

  db.query(
    sql,
    [name, address, age, phone_number, email, passward],
    (err, result) => {
      if (err) throw err;
      console.log("Record inserted:", result.affectedRows);
    }
  );
  res.render("user_login");
});

app.get("/admin_login", (req, res) => {
  res.render("admin_login");
});

app.post("/admin_login", (req, res) => {
  const { email, password } = req.body;

  const sql = `SELECT * FROM admin WHERE email = ? AND password = ?`;
  db.query(sql, [email, password], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      // Store user in session
      req.session.user = {
        id: results[0].admin_id,
        name: results[0].username,
        email: results[0].email,
        password: results[0].password,
        phone_number: results[0].phone_no,
        role: 'admin'
      };

      res.redirect("/admin");
    } else {
      res.redirect("/admin_login");
    }
  });
});

app.get("/admin", isAdmin, (req, res) => {
  res.render("admin");
});

app.get("/user_login", (req, res) => {
  res.render("user_login");
});

app.post("/user_login", (req, res) => {
  const { email, passward } = req.body;

  const sql = `SELECT * FROM users WHERE email = ? AND passward = ?`;
  db.query(sql, [email, passward], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      req.session.user = {
        id: results[0].user_id,
        name: results[0].name,
        email: results[0].email,
        address: results[0].address,
        age: results[0].age,
        phone_number: results[0].phone_number,
        password: results[0].password,
      };

      console.log("Session after login:", req.session);
      res.redirect("/");
    } else {
      res.redirect("/user_login");
    }
  });
});

app.get("/profile", (req, res) => {
  res.render("profile", { user: req.session.user });
  console.log(req.session.user);
});

app.get("/edit-profile", (req, res) => {
  res.render("edit_profile", { user: req.session.user });
});

app.post("/edit-profile", (req, res) => {
  const { name, email, age, address, phone_number } = req.body;
  const uid = req.session.user.id;

  const sql = `UPDATE users SET name = ?, email = ?, age = ?, address = ?, phone_number = ? WHERE user_id = ?`;
  db.query(
    sql,
    [name, email, age, address, phone_number, uid],
    (err, result) => {
      if (err) throw err;
      console.log("Record updated:", result.affectedRows);
      // Update session data
      req.session.user.name = name;
      req.session.user.email = email;
      req.session.user.age = age;
      req.session.user.address = address;
      req.session.user.phone_number = phone_number;
      res.redirect("/profile");
    }
  );
});

app.get("/product/:pid", (req, res) => {
  const productId = req.params.pid;
  const sql = `SELECT * FROM products WHERE product_id = ?`;
  let cartCount = 0;
  if (req.session.user) {
    const countSql = "SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?";
    db.query(countSql, [req.session.user.id], (err, result) => {
      if (err) throw err;
      cartCount = result[0] ? result[0].count || 0 : 0;
      db.query(sql, [productId], (err, result) => {
        if (err) throw err;
        const product = result[0];
        res.render("product_detail", { product, user: req.session.user, cartCount });
      });
    });
  } else {
    db.query(sql, [productId], (err, result) => {
      if (err) throw err;
      const product = result[0];
      res.render("product_detail", { product, user: req.session.user, cartCount });
    });
  }
});

app.get("/additems", isAdmin, (req, res) => {
  console.log("hii");
  res.render("additems");
});

app.post("/additems", isAdmin, (req, res) => {
  const uid = req.session.user.id;
  const { name, price, quantity, img_url } = req.body;
  const sql = `INSERT INTO products(product_name,price,quantity,img_url) VALUES (?,?,?,?)`;

  db.query(sql, [name, price, quantity, img_url], (err, result) => {
    if (err) throw err;
    console.log("Record inserted:", result.affectedRows);
  });
  res.redirect("/admin");
});

app.get("/view_products", isAdmin, (req, res) => {
  db.query("SELECT * FROM products", (err, products) => {
    if (err) throw err;
    res.render("view_products", { products });
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Error logging out.");
    }
    res.clearCookie("connect.sid"); // Optional: clear cookie
    res.redirect("/");
  });
});

app.get("/cart", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/user_login");
  }
  const id = req.session.user.id;
  let cartCount = 0;
  const countSql = "SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?";
  db.query(countSql, [id], (err, result) => {
    if (err) throw err;
    cartCount = result[0].count || 0;

    const sql = `
      SELECT 
          c.cart_id,
          c.user_id,
          c.quantity,
          u.name AS user_name,
          u.address,
          u.phone_number,
          p.product_id,
          p.product_name,
          p.price,
          p.img_url
      FROM cart c
      JOIN users u ON c.user_id = u.user_id
      JOIN products p ON c.product_id = p.product_id
      WHERE c.user_id = ?;
  `;

    db.query(sql, [id], (err, products) => {
      if (err) throw err;
      let total = 0;
      let titem = 0;
      for (const item of products) {
        total += item.price * item.quantity;
        titem += item.quantity;
      }
      res.render("cart", { products, total, titem, user: req.session.user, cartCount });
    });
  });
});

app.get("/addtocart/:id", (req, res) => {
  if (!req.session.user || !req.session.user.id) {
    return res.redirect("/user_login");
  }

  const productId = req.params.id;
  const uid = req.session.user.id;

  const sql = `INSERT INTO cart(user_id,product_id,quantity) VALUES (?,?,?)`;
  db.query(sql, [uid, productId, 1], (err, result1) => {
    if (err) throw err;
  });
  res.redirect("/");
});

app.get("/bills", (req, res) => {
  db.query("select * from bills", (err, result) => {
    render("bills", result);
  });
});

app.get("/updatecartminus/:pid", (req, res) => {
  const uid = req.session.user.id;
  // console.log(uid)
  const pid = req.params.pid;
  // console.log(pid)
  let q;
  // console.log(q)
  const sql = "select quantity from cart where user_id = ? and product_id = ?";
  db.query(sql, [uid, pid], (err, result) => {
    q = result[0].quantity;
    if (q == 1) {
      const sql = "delete from cart where user_id = ? and product_id = ?";
      db.query(sql, [uid, pid], (err, result) => {});
    } else {
      q = q - 1;
      const sql =
        "update cart set quantity = ? where user_id = ? and product_id = ?";
      db.query(sql, [q, uid, pid], (err, result) => {});
    }
  });
  res.redirect("/cart");
});

app.get("/updatecartplus/:pid", (req, res) => {
  const uid = req.session.user.id;
  console.log(uid);
  const pid = req.params.pid;
  console.log(pid);
  let q;
  console.log(q);
  const sql = "select quantity from cart where user_id = ? and product_id = ?";
  db.query(sql, [uid, pid], (err, result) => {
    q = result[0].quantity;
    q = q + 1;
    const sql =
      "update cart set quantity = ? where user_id = ? and product_id = ?";
    db.query(sql, [q, uid, pid], (err, result) => {});
  });
  res.redirect("/cart");
});

app.get("/billing", (req, res) => {
  const uid = req.session.user.id;
  const status = "Pending";

  // Fetch up to 3 cart items for this user
  const getCart = `
        SELECT c.product_id, c.quantity, p.price 
        FROM cart c 
        JOIN products p ON c.product_id = p.product_id 
        WHERE c.user_id = ? LIMIT 3
    `;

  db.query(getCart, [uid], (err, cartItems) => {
    if (err) {
      console.log(err);
      return res.send("Error fetching cart");
    }

    if (cartItems.length === 0) {
      return res.send("Cart is empty!");
    }

    // Initialize placeholders
    let p1 = null,
      q1 = null,
      p2 = null,
      q2 = null,
      p3 = null,
      q3 = null;

    let total = 0;

    // Map cart items into p1,q1,p2,q2,p3,q3
    if (cartItems[0]) {
      p1 = cartItems[0].product_id;
      q1 = cartItems[0].quantity;
      total += cartItems[0].price * cartItems[0].quantity;
    }
    if (cartItems[1]) {
      p2 = cartItems[1].product_id;
      q2 = cartItems[1].quantity;
      total += cartItems[1].price * cartItems[1].quantity;
    }
    if (cartItems[2]) {
      p3 = cartItems[2].product_id;
      q3 = cartItems[2].quantity;
      total += cartItems[2].price * cartItems[2].quantity;
    }

    // Insert into bills table
    const insertBill = `
            INSERT INTO bills (user_id, p1, q1, p2, q2, p3, q3, total_amount, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
    db.query(
      insertBill,
      [uid, p1, q1, p2, q2, p3, q3, total, status],
      (err2) => {
        if (err2) {
          console.log(err2);
          return res.send("Error while saving bill");
        }

        // Clear cart
        const clearCart = "DELETE FROM cart WHERE user_id = ?";
        db.query(clearCart, [uid], (err3) => {
          if (err3) console.log(err3);
          res.redirect("/cart");
        });
      }
    );
  });
});

app.get("/my-bills", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/user_login");
  }
  const uid = req.session.user.id;
  let cartCount = 0;
  const countSql = "SELECT SUM(quantity) AS count FROM cart WHERE user_id = ?";
  db.query(countSql, [uid], (err, result) => {
    if (err) throw err;
    cartCount = result[0].count || 0;

    const sql = `
        SELECT 
            b.bill_id, b.total_amount, b.status, b.bill_date,
            p1.product_name AS item1, b.q1 AS q1,
            p2.product_name AS item2, b.q2 AS q2,
            p3.product_name AS item3, b.q3 AS q3
        FROM bills b
        LEFT JOIN products p1 ON b.p1 = p1.product_id
        LEFT JOIN products p2 ON b.p2 = p2.product_id
        LEFT JOIN products p3 ON b.p3 = p3.product_id
        WHERE b.user_id = ?
        ORDER BY b.bill_date DESC
    `;

    db.query(sql, [uid], (err, bills) => {
      if (err) {
        console.log(err);
        return res.send("Error fetching bills");
      }
      res.render("userbilling", { bills, user: req.session.user, cartCount });
    });
  });
});

// Show all bills (Admin only)
app.get("/admin_bills", isAdmin, (req, res) => {
  const sql = `
        SELECT 
            b.bill_id, b.total_amount, b.status, b.bill_date, 
            u.name AS username,
            p1.product_name AS item1, b.q1 AS q1,
            p2.product_name AS item2, b.q2 AS q2,
            p3.product_name AS item3, b.q3 AS q3
        FROM bills b
        JOIN users u ON b.user_id = u.user_id
        LEFT JOIN products p1 ON b.p1 = p1.product_id
        LEFT JOIN products p2 ON b.p2 = p2.product_id
        LEFT JOIN products p3 ON b.p3 = p3.product_id
        ORDER BY b.bill_date DESC
    `;

  db.query(sql, (err, bills) => {
    if (err) {
      console.log(err);
      return res.send("Error fetching bills");
    }
    res.render("adminbillings", { bills });
    console.log(bills);
  });
});

// Update bill status
app.post("/update-bill/:bill_id", isAdmin, (req, res) => {
  const { status } = req.body;
  const bill_id = req.params.bill_id;

  const sql = "UPDATE bills SET status = ? WHERE bill_id = ?";
  db.query(sql, [status, bill_id], (err) => {
    if (err) {
      console.log(err);
      return res.send("Error updating status");
    }
    res.redirect("/admin_bills");
  });
});
