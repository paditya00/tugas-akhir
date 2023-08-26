import { request, response } from "express";
import * as UserRepo from "../repository/query.js";
import { errorResp, successResp } from "../utils/response.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY_AT = "toko-buah.com";
const SECRET_KEY_RT = "aditya.co.id";

export const getBuah = async (request, response, next) => {
  try {
    const [result] = await UserRepo.getBuah();
    successResp(response, "success", result);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (request, response, next) => {
  try {
    const [result] = await UserRepo.getUsers();
    successResp(response, "success", result);
  } catch (error) {
    next(error);
  }
};

export const createBuah = async (request, response, next) => {
  try {
    let fruit = request.body.fruit;
    let harga = request.body.harga;

    const [result] = await UserRepo.createBuah(fruit, harga);
    let id = result.insertId;
    const [fruits] = await UserRepo.getBuahById(id);
    successResp(response, "success create user", fruits[0], 201);
  } catch (error) {
    next(error);
  }
};

export const createUser = async (request, response, next) => {
  try {
    let name = request.body.name;
    let email = request.body.email;
    let password = request.body.password;

    const saltRound = 10;
    bcrypt.hash(password, saltRound, async (err, hash) => {
      const [result] = await UserRepo.createUser(name, email, hash);
      let id = result.insertId;

      await UserRepo.createKeranjang(id);
      const [users] = await UserRepo.getUserById(id);
      successResp(response, "success create user", users[0], 201);
    });
  } catch (error) {
    errorResp(response, "Data gagal ditambahkan", 500);
  }
};

export const throwInCarts = async (request, response, next) => {
  try {
    let carts = request.body.carts;
    let buah = "";
    if (Array.isArray(carts)) {
      const results = await UserRepo.throwInCarts(carts);
      for (let i = 0; i < results.length; i++) {
        let [fruits] = await UserRepo.getBuahById(results[i]);
        console.log(fruits[0].fruit);
        let k = i + 1;
        buah = buah + k + ". " + fruits[0].fruit + " | ";
      }
      console.log(buah);
      successResp(response, "success throw in cart", buah, 201);
    } else {
      let id_cart = request.body.id_cart;
      let id_fruit = request.body.id_fruit;
      const [result] = await UserRepo.throwInCart(id_cart, id_fruit);
      let id = result.insertId;
      const [fruit] = await UserRepo.getBuahById(id_fruit);
      successResp(response, "success throw in cart", fruit[0].fruit, 201);
    }
  } catch (error) {
    next(error);
  }
};

export const checkOutProduct = async (request, response, next) => {
  try {
    let id_user = request.body.id_user;
    let product = request.body.product;

    let total = 0;
    let newProduct = "";
    for (let i = 0; i < product.length; i++) {
      let [cart] = await UserRepo.getCartUser(product[i].id);
      let [fruit] = await UserRepo.getBuahById(cart[0].id_fruit);
      newProduct = newProduct + "-" + cart[0].id_fruit;
      let hargaBuah = fruit[0].harga;
      hargaBuah = hargaBuah.split(".");
      let newHarga = "";
      for (let k = 1; k < hargaBuah.length; k++) {
        newHarga = newHarga + hargaBuah[k];
      }
      total = total + parseInt(newHarga);
      UserRepo.deleteCart(product[i].id);
    }

    total = total.toString();

    let totalString = "";
    for (let i = 1; i <= total.length; i++) {
      if (i % 3 == 0) {
        totalString = "." + total[total.length - i] + totalString;
      } else {
        totalString = total[total.length - i] + totalString;
      }
    }

    let Harga = "Rp. " + totalString;

    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let randomCode = "";

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomCode += characters.charAt(randomIndex);
    }

    const [result] = await UserRepo.checkOut(
      id_user,
      newProduct,
      Harga,
      randomCode
    );
    successResp(
      response,
      "proses checkout berhasil, segera selesaikan pembayaran",
      randomCode,
      201
    );
  } catch (error) {
    next(error);
  }
};

export const showAllCart = async (request, response, next) => {
  try {
    let id_cart = request.body.id_cart;
    let [result] = await UserRepo.getCart(id_cart);

    successResp(response, "success", result[0], 201);
  } catch (error) {
    next(error);
  }
};

export const authenticationUser = async (request, response, next) => {
  try {
    let email = request.body.email;
    let password = request.body.password;
    const [result] = await UserRepo.getDataByEmail(email);

    if (result.length > 0) {
      const user = result[0];

      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          let claims = {
            id: user.user_id,
            name: user.name,
            email: user.email,
          };

          const accessToken = jwt.sign(claims, SECRET_KEY_AT, {
            expiresIn: "15m",
          });
          const refreshToken = jwt.sign(claims, SECRET_KEY_RT, {
            expiresIn: "30m",
          });
          let data = {
            access_token: accessToken,
            refresh_token: refreshToken,
          };
          successResp(response, "berhasil login", data);
        }
      });
    } else {
      errorResp(response, "email atau password tidak cocok");
    }
  } catch (error) {
    next(error);
  }
};
