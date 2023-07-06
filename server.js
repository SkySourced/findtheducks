import express from "express";
import session from "express-session";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";

import indexRouter from "./routes/index.js";
import userRouter from "./routes/users.js";

import duckFact from "./duckFacts.js";

const app = express(); // Create express app

app.use(logger("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true })); // Parse form submissions
app.use(bodyParser.json());

app.set("view engine", "ejs"); // Set view engine to ejs

app.use(session({ // Set up session
	secret: process.env.SESSION_KEY_SECRET,
	cookie: {
		sameSite: "strict",
		maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
	},
	resave: false,
	saveUninitialized: true
}));

app.use("/", indexRouter);
app.use("/users", userRouter); // Use user router

app.get("*", (req, res) => { // 404
	res.status(404).render("errors/generic", { errorCode: 404, message: "If it looks like a duck, quacks like a duck, it's a duck. But I don't think this is a duck.", pageTitle: 404, authorised: req.session.authorised, permissions: req.session.permissions, duckFact: duckFact()});
});

app.use(express.static("public")); // Serve static files

export default app; // Export app for testing