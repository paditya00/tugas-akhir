import dbPool from "../utils/db.js";

export const createUser = (name, email, password) => {
  const sql = "INSERT INTO tb_users (name, email, password) VALUE (?, ?, ?)";
  const value = [name, email, password];
  const result = dbPool.query(sql, value);

  return result;
};

export const createKeranjang = (id) => {
  const sql = `INSERT INTO tb_carts (id_user) VALUE (${id})`;
  const result = dbPool.query(sql);

  return result;
};

export const createBuah = (fruit, harga) => {
  const sql = "INSERT INTO tb_fruits (fruit, harga) VALUE (?, ?)";
  const value = [fruit, harga];
  const result = dbPool.query(sql, value);

  return result;
};

export const updateUser = (id, name, email) => {
  const sql = "UPDATE tb_users SET name = ?, email=? WHERE id_user = ?";
  const value = [name, email, id];
  const result = dbPool.query(sql, value);

  return result;
};

export const updateBuah = (id, fruit, harga) => {
  const sql = "UPDATE tb_fruits SET fruit = ?, harga=? WHERE id_fruit = ?";
  const value = [fruit, harga, id];
  const result = dbPool.query(sql, value);

  return result;
};

export const deleteUser = (id) => {
  const sql = "DELETE FROM tb_users WHERE id_user = ?";
  const result = dbPool.query(sql, [id]);

  return result;
};

export const deleteBuah = (id) => {
  const sql = "DELETE FROM tb_fruits WHERE id_fruit = ?";
  const result = dbPool.query(sql, [id]);

  return result;
};

export const getUsers = () => {
  const sql = "SELECT * FROM tb_users";

  return dbPool.query(sql);
};

export const getBuah = () => {
  const sql = "SELECT * FROM tb_fruits";

  return dbPool.query(sql);
};

export const getUserByEmail = (email) => {
  const sql = "SELECT * FROM tb_users WHERE email = ?";

  return dbPool.query(sql, [email]);
};

export const getUserById = (id) => {
  const sql = "SELECT name, email, password FROM tb_users WHERE id_user = ?";
  return dbPool.query(sql, [id]);
};

export const getBuahById = (id) => {
  const sql = "SELECT fruit, harga FROM tb_fruits WHERE id_fruit = ?";
  return dbPool.query(sql, [id]);
};

export const getCartUser = (id) => {
  const sql = "SELECT id_fruit FROM tb_cartuser WHERE id = ?";
  return dbPool.query(sql, [id]);
};

export const throwInCarts = async (data) => {
  let buah = [];
  const sql = "INSERT INTO tb_cartuser (id_cart, id_fruit) VALUE (?, ?)";
  for (const d of data) {
    buah.push(d.id_fruit);
    let value = [d.id_cart, d.id_fruit];
    await dbPool.query(sql, value);
  }
  return buah;
};

export const throwInCart = (id_cart, id_fruit) => {
  const sql = "INSERT INTO tb_cartuser (id_cart, id_fruit) VALUE (?, ?)";
  let value = [id_cart, id_fruit];
  const result = dbPool.query(sql, value);

  return result;
};

export const checkOut = (id_user, product, total, virtualAcc) => {
  const sql =
    "INSERT INTO tb_checkouts (id_user, product, total, virtualAcc) VALUE (?, ?, ?, ?)";
  let value = [id_user, product, total, virtualAcc];
  const result = dbPool.query(sql, value);

  return result;
};

export const deleteCart = (id) => {
  const sql = `DELETE FROM tb_cartuser WHERE id = ${id}`;
  dbPool.query(sql);
};

export const getCart = (id) => {
  const sql = `SELECT * FROM tb_cartuser WHERE id_cart = ${id}`;
  const result = dbPool.query(sql);

  return result;
};
