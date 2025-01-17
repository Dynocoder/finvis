const express = require("express");
const next = require("next");
const { Socket, Server } = require("socket.io");
const bodyParser = require("body-parser");
const yahooFinance = require("yahoo-finance2").default;
require("dotenv").config();

const port = process.env.PORT;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

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

    const result = await yahooFinance.quote(stock_name.toUpperCase());

    res.json(result);
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

    socket.on("stock", (message) => {
      console.log(`[Server]: message Received: ${message}`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected due to ${reason}`);
    });
  });
});
