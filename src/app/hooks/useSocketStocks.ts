import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { PriceData } from "../quotes/[stock_name]/StockQuotePage";
import { UTCTimestamp } from "lightweight-charts";

export interface PriceTimeSeries {
  value: number,
  time: UTCTimestamp
}

const useSocketStock = (stockName: string, stockData: any) => {

  const time = new Date(stockData.regularMarketTime);
  const stockObj: PriceData = {
    price: stockData.regularMarketPrice,
    time: Math.floor(time.getTime()) as UTCTimestamp,
    change: stockData.regularMarketChange,
    changePercent: stockData.regularMarketChangePercent
  }

  const [stock, setStock] = useState<PriceData>(stockObj);
  const [isConnected, setIsConnected] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socket = io();

    socket.on('connect', () => {
      console.log("Connection Established with Server.");
      socket.emit('stock_name_data', stockName);
      setSocket(socket);
      setIsConnected(true);
    });

    socket.on("message", (message) => {
      console.log("[Client] received: " + JSON.stringify(message));
      setStock(message as PriceData);
    })

    socket.on('disconnect', () => {
      console.log("Socket Disconnected.");
    })

    return () => {
      socket.disconnect();
      setIsConnected(false);
    }
  }, [stockName]);

  return { stock, isConnected };

}
export default useSocketStock;
