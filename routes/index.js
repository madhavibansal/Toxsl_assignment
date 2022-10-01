const { verify } = require("../jwtverify/index");
const {register, login, getUser} = require("../modules/index");
const {upload} = require("../modules/imageUpload")
const route = (app) => {
    app.post("/register", upload.array('myFile',12),register);
    app.post("/login",login);
    app.get("/get-user",verify,getUser)
}
module.exports = route;

