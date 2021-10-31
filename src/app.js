import app from "./index";

app.listen(process.env.PORT, () => {
    console.log(process.env.PORT, "서버 시작");
});
