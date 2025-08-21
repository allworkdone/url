const express = require("express")
const path = require("path")
const cookieParser = require("cookie-parser")
const { connectToMongoDB } = require("./connect")
const urlRoute = require("./routes/url")
const { restrictToLoggedInUserOnly } = require('./middleware/auth')

const URL = require("./models/url")
const staticRoute = require('./routes/staticRouter')
const userRoute = require('./routes/user')
const app = express()
const port = 8001;

connectToMongoDB("mongodb://admin:admin@10.183.52.190:27017/short-url?authSource=admin")
  .then(console.log("Connected to MongoDB successfully!"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", restrictToLoggedInUserOnly, urlRoute);
app.use("/user", userRoute);
app.use("/", staticRoute);
app.use(cookieParser());


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

