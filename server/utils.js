import yahooFinance from "yahoo-finance2";

//TODO: if the market isn't open yet, but the day is started (time < 9:30 hrs) we need to roll back to last session
export async function fetchLatestTradingSession(symbol, marketTime) {
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
        time: date.getTime() / 1000,
        value: quote.close,
      };
    });

    return chartData;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

/**
 * Add the stock and the subscriber socket id to the list
 *
 * @param {Array<{stock: string, subs: Array<string>}>} set the array to manage as a set
 * @param {string} eventStock the stock to subscribe to
 * @param {string} subscriberId the socket id of the subscribing client
 * @param {number} [maxSetLength=30] Maximun number of stocks the program can subscribe to
 * @return {{stock: string, subs: Array<string>}}
 */
export function addSubscriberSet(
  set,
  eventStock,
  subscriberId,
  maxSetLength = 30,
) {
  if (set.length === 0) {
    const temp = { stock: eventStock, subs: [subscriberId] };
    set.push(temp);
    return temp;
  } else if (set.length === 30) {
    return new Error(
      `Max Stock subscription limit reached, limit: ${maxSetLength}`,
    );
  }

  for (let i = 0; i < set.length && i < maxSetLength; i++) {
    const element = set[i];
    if (element.stock === eventStock) {
      const temp = { stock: element.stock, subs: element.subs };
      element.subs.push(subscriberId);
      return temp;
    }
  }

  const temp = { stock: eventStock, subs: [subscriberId] };
  set.push(temp);
  return temp;
}

/**
 * @param {Array<{stock: string, subs: Array<string>}>} set the array to manage as a set
 * @param {string} subscriberId the socket id of the subscribing client
 */
export function removeSubscriberSet(set, subscriberId) {
  //TODO: remove the stocks that disconnect
}
