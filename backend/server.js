//   2:05 , 2:25
// * importing
import dotenv from "dotenv"
dotenv.config()
import express from "express";
import mongoose from "mongoose";
import Messages from "./dbMessages.js";
import mongoData from "./mongoData.js";
import Pusher from "pusher";
import bodyParser from "body-parser"

// const crypto = require('crypto');

// * app config
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
const port = process.env.PORT || 9000;

const pusher = new Pusher({
  appId: process.env.PUSHER_ID,
  key: process.env.PUSHER_KEY ,
  secret: process.env.PUSHER_SECRET ,
  cluster: "eu",
  useTLS: true,
});

// * middleware
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

// * DB config
const connection_url =
  "mongodb+srv://admin:"+process.env.DB_PASS+"@cluster0.92dw9.mongodb.net/whatsappDB?retryWrites=true&w=majority";

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection; //* -->Making Real-Time at 2:59
db.once("open", () => {
  console.log("DB is Connected");

  const msgCollection = db.collection("conversations"); //imp Don't forget to pularize the collection name
  const changeStream = msgCollection.watch();


  changeStream.on("change", (change) => {
    // console.log("A changed occured ", change);

    // imp at 3:10 , link - https://dashboard.pusher.com/apps/1115516/getting_started
    if (change.operationType === "insert") {
      // const messageDetails = change.fullDocument;
      // console.log("New channel created");
      pusher.trigger("channels", "newChannel", {
        'change':change                         //-->discord mern 1:48
      });
    } else if(change.operationType === "update") {
      pusher.trigger("conversation", "newMessage", {
        'change':change
      });
    } else {
      console.log("Error triggering Pusher");
    }
  });

});



// * api routes
app.get("/", (req, res) => {
  res.status(200).send("Hello Ji");
});

app.post("/new/channel", (req, res) => {
  // console.log(req.body);
  const dbData = req.body;

  mongoData.create(dbData, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.get("/get/channelList", (req, res) => {
  mongoData.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      let channels = [];

      data.map((channelData) => {
        const channelInfo = {
          id: channelData._id,
          name: channelData.channelName,
        };
        channels.push(channelInfo);
      });

      res.status(200).send(channels);
    }
  });
});

app.post("/new/message", (req, res) => {
  //   const id = req.query.id;
  // const newMessage = req.body;
  // console.log(newMessage);

  mongoData.update(
    { _id: req.query.id },
    { $push: { conversation: req.body } },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    }
  );
});

app.get("/get/data", (req, res) => {
  mongoData.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.get("/get/conversation", (req, res) => {
  const id = req.query.id;

  mongoData.find({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

// * -----------------------------------------------------------------
// app.get("/messages/sync", (req, res) => {
//   Messages.find((err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(200).send(data);
//     }
//   });
// });

// app.post("/messages/new", (req, res) => {
//   const dbMessage = req.body;

//   Messages.create(dbMessage, (err, data) => {
//     if (err) {
//       res.status(500).send(err);
//     } else {
//       res.status(201).send(data);
//     }
//   });
// });

// * listen
app.listen(port, () => console.log(`Listening at port:${port}`));
