const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const listingController = require("../controllers/users.js");
const { signedCookie } = require("cookie-parser");

router.route("/signup")
    .get(listingController.renderSignupForm)
    .post(wrapAsync(listingController.signup));

router.route("/login")
    .get(listingController.renderLoginForm)
    .post(saveRedirectUrl, passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }), listingController.login);

router.get("/logout", listingController.logout);

module.exports = router;