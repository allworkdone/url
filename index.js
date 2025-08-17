const express = require("express")
const path = require("path")
const { connectToMongoDB } = require("./connect")
const urlRoute = require("./routes/url")
const URL = require("./models/url")
const staticRoute= require('./routes/staticRouter')
const app = express()
const port = 8001;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url')
  .then(console.log("Connected to MongoDB successfully!"));

  app.set("view engine", "ejs");
  app.set("views",path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);

app.use ("/", staticRoute);


app.get('/url/:shortId', async (req, res) => {
  const shortId = req.params.shortId;

  //debug
  console.log("Short ID:", shortId);
console.log("type of shortId:", typeof shortId);

  const entry = await URL.findOneAndUpdate({
    shortId,
  },
    {
      $push: {
        visitHistory:
        {
          timestamp: Date.now(),
        }
      },
    }
  );

  console.log("Entry found:", entry);

  if (!entry) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.redirect(entry.redirectURL);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

