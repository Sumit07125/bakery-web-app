const db = require('../db');

exports.getRegister = (req, res) => {
  res.render("register");
};

exports.postRegister = (req, res) => {
  const { name, address, age, phone_number, email, passward } = req.body;
  const sql = `INSERT INTO users (name,address,age,phone_number,email,passward) VALUES (?,?,?,?,?,?)`;
  db.query(sql, [name, address, age, phone_number, email, passward], (err, result) => {
    if (err) throw err;
    console.log("Record inserted:", result.affectedRows);
  });
  res.render("user_login");
};

exports.getUserLogin = (req, res) => {
  res.render("user_login");
};

exports.postUserLogin = (req, res) => {
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
      res.redirect("/");
    } else {
      res.redirect("/user_login");
    }
  });
};

exports.getAdminLogin = (req, res) => {
  res.render("admin_login");
};

exports.postAdminLogin = (req, res) => {
  const { email, password } = req.body;
  const sql = `SELECT * FROM admin WHERE email = ? AND password = ?`;
  db.query(sql, [email, password], (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
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
};

exports.getAdmin = (req, res) => {
  res.render("admin");
};

exports.getProfile = (req, res) => {
  res.render("profile", { user: req.session.user });
};

exports.getEditProfile = (req, res) => {
  res.render("edit_profile", { user: req.session.user });
};

exports.postEditProfile = (req, res) => {
  const { name, email, age, address, phone_number } = req.body;
  const uid = req.session.user.id;
  const sql = `UPDATE users SET name = ?, email = ?, age = ?, address = ?, phone_number = ? WHERE user_id = ?`;
  db.query(sql, [name, email, age, address, phone_number, uid], (err, result) => {
    if (err) throw err;
    req.session.user.name = name;
    req.session.user.email = email;
    req.session.user.age = age;
    req.session.user.address = address;
    req.session.user.phone_number = phone_number;
    res.redirect("/profile");
  });
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).send("Error logging out.");
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};
