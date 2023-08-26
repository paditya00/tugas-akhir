import express from "express";
import userRouter from "./routers/routers.js";
import { errorResp } from "./utils/response.js";

const app = express();
const port = 8080;
const host = "localhost";

app.use(express.json());
app.use("/users", userRouter);

app.use((error, request, response, next) => {
  const message = "internal server error";
  console.log(error.message);
  errorResp(response, message, 500);
});

app.listen(port, host, () => {
  console.log(`server berjalan di http://${host}:${port}`);
});
