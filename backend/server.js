const express = require("express");
const cors = require("cors");
const fs = require("fs");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json());

const PRODUCTS_FILE = "./data/products.json";
const REVIEWS_FILE = "./data/reviews.json";
const QUESTIONS_FILE = "./data/questions.json";

// 📌 Producten ophalen
app.get("/products", (req, res) => {
  const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));
  res.json(products);
});

// 📌 Review toevoegen
app.post("/reviews", (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  const newReview = { id: Date.now(), approved: false, ...req.body };
  reviews.push(newReview);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
  res.json({ message: "Review verstuurd en wacht op goedkeuring!" });
});

// 📌 Admin: Review goedkeuren
app.put("/reviews/:id/approve", (req, res) => {
  let reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE));
  reviews = reviews.map((review) =>
    review.id == req.params.id ? { ...review, approved: true } : review
  );
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
  res.json({ message: "Review goedgekeurd!" });
});

// 📌 Vraag insturen
app.post("/questions", (req, res) => {
  const questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE));
  const newQuestion = { id: Date.now(), answered: false, ...req.body };
  questions.push(newQuestion);
  fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
  res.json({ message: "Vraag verstuurd!" });
});

// 📌 Admin: Vraag beantwoorden
app.post("/questions/:id/answer", (req, res) => {
  let questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE));
  const question = questions.find((q) => q.id == req.params.id);
  if (!question) return res.status(404).json({ error: "Vraag niet gevonden" });

  // 📩 E-mail sturen naar gebruiker
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "jouw-email@gmail.com",
      pass: "jouw-wachtwoord"
    }
  });

  let mailOptions = {
    from: "jouw-email@gmail.com",
    to: question.email,
    subject: "Antwoord op je vraag",
    text: req.body.answer
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) return res.status(500).json({ error: "E-mail verzenden mislukt" });

    questions = questions.map((q) =>
      q.id == req.params.id ? { ...q, answered: true, answer: req.body.answer } : q
    );
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(questions, null, 2));
    res.json({ message: "Vraag beantwoord!" });
  });
});

app.listen(5000, () => console.log("Server draait op poort 5000!"));
