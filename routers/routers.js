import e from "express";
import * as UserService from "../services/userServices.js";

const userRouter = e.Router();

userRouter.get("/", UserService.getUser); // Cek Semua User
userRouter.get("/buah", UserService.getBuah); // Cek Semua Produk Buah
userRouter.post("/", UserService.createUser); // Buat Akun
userRouter.post("/buah", UserService.createBuah); // Tambahkan Produk Buah
userRouter.post("/carts", UserService.throwInCarts); // Masukkan ke keranjang, bisa langsung banyak bisa satu-satu
userRouter.post("/showCart", UserService.showAllCart); // Menambilkan keranjang
/* 
Contoh penulisan di postman ketika akan memasukkan banyak buah ke keranjang :
        {
            "carts":[{
            "id_cart":1,
            "id_fruit":1
        },
        {
            "id_cart":1,
            "id_fruit":2
        },
        {
            "id_cart":1,
            "id_fruit":3
        }]
        }

Contoh penulisan ketika memasukan satu buah saja:
        {
            "id_cart":1,
            "id_fruit":3
        }
*/
userRouter.post("/checkout", UserService.checkOutProduct); // Checkout Product
userRouter.post("/auth", UserService.authenticationUser); // Login
export default userRouter;
