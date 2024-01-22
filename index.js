const dotenv = require("dotenv").config();
const stripe = require("stripe")(process.env.REACT_APP_STRIPE_PK);
const cors = require("cors");

const express = require("express");
const app = express();
const port = 3005;

app.use(cors());

app.get("/", async (req, res) => {
  res.send("Hello World!");
});

app.get("/session", (req, res) => {
  res.send("Hello 22World!");
});

const YOUR_DOMAIN = "http://localhost:3000";

app.post("/test", async (req, res) => {
  res.send("hola");
});

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    ui_mode: "embedded",
    return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
  });

  console.log(session);
  res.send({ clientSecret: session.client_secret, session: session });
});

app.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
  res.send({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

app.listen(process.env.PORT || 3000, () => {
});
