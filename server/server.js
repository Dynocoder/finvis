const express = require("express");
const next = require("next");
const { Socket, Server } = require("socket.io");
const bodyParser = require("body-parser");
const yahooFinance = require("yahoo-finance2").default;
const { fetchLatestTradingSession, addSubscriberSet } = require("./utils");
const { Kafka } = require("kafkajs");
require("dotenv").config();

const port = process.env.PORT;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const subs = [];

async function initKafka() {
  const kafka = new Kafka({
    clientId: "nextjs-app",
    brokers: ["0.0.0.0:9092"],
  });
  const consumer = kafka.consumer({ groupId: "nextjs-group" });
  try {
    await consumer.connect();

    await consumer.subscribe({ topic: "my-topic" });

    consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log(message.value);
        messageRelay(message);
      },
    });
  } catch (err) {
    console.log(`Error connecting to Kafka: ${err}`);
    consumer.stop();
  }
}

function messageRelay(message) {
  subs.forEach((sub) => {
    console.log(sub);
  });
}

app.prepare().then(() => {
  const server = express();

  // Middleware
  server.use(bodyParser.json());

  // market open
  server.get("/api/market-status", (req, res) => {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();

    const isWeekday = day >= 1 && day <= 5;
    const isMarketHours = hour >= 9 && hour < 16;

    const marketStatus = {
      isOpen: isWeekday && isMarketHours,
    };

    res.json(marketStatus);
  });

  // static stock data
  server.get("/api/stock/:stock_name", async (req, res) => {
    const { stock_name } = req.params;

    yahooFinance.suppressNotices(["yahooSurvey"]);
    const quote = await yahooFinance.quote(stock_name.toUpperCase());
    const series = await fetchLatestTradingSession(
      stock_name,
      quote.regularMarketTime,
    );

    const filtered_series = series.filter((data) => {
      if (data && data.value != null && data.time != null) {
        return data;
      }
    });

    res.json({ quote, filtered_series });
  });

  server.get("*", (req, res) => {
    handle(req, res);
  });

  const httpServer = server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Listening at port ${port}`);
  });

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log(
      `New Socket ${socket.id} connected, Count: ${io.engine.clientsCount}`,
    );

    socket.on("stock_name_data", (message) => {
      console.log(`[Server]: message Received: ${message}`);
      addSubscriberSet(subs, message, socket.id);
      console.log(subs);
    });

    socket.on("disconnect", (reason) => {
      //TODO: remove the stocks from subs that disconnect
      console.log(`Client disconnected due to ${reason}`);
    });
  });

  // kafka
  initKafka();
});
