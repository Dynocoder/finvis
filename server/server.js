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

async function fetchLatestTradingSession(symbol, marketTime) {
  // Get current date and time
  const now = new Date();

  // Create start of day (9:30 AM ET)
  const startOfSession = new Date(marketTime);
  startOfSession.setHours(9, 30, 0, 0);

  // Create end of day (4:00 PM ET) or current time if market is still open
  const endOfSession = new Date(marketTime);
  endOfSession.setHours(16, 0, 0, 0);

  // If current time is before 4 PM, use current time as end
  const endTime =
    now < endOfSession && now.getDate() === marketTime.getDate()
      ? now
      : endOfSession;

  try {
    const result = await yahooFinance.chart(symbol, {
      period1: startOfSession, // Start time
      // period2: endTime, // End time
      interval: "1m", // 1-minute intervals
      includePrePost: false, // Exclude pre/post market data
    });

    // Transform the data for lightweight-charts
    let done = false;
    const chartData = result.quotes.map((quote) => {
      if (!done) {
        console.log(
          `before: ${quote.date}, trans: ${new Date(quote.date).getTime()}`,
        );
        done = true;
      }

      const date = new Date(quote.date);

      return {
        time: date.getTime(),
        value: quote.close,
      };
    });

    return chartData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
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
    });

    socket.on("disconnect", (reason) => {
      console.log(`Client disconnected due to ${reason}`);
    });
  });
});
