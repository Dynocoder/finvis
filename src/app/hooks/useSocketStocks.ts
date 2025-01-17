import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface Stock {
  value: number,
  time: number
}

const useSocketStock = (stockName: string) => {
  const [stock, setStock] = useState<Stock | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const data: Array<any> = [{ value: 0, time: 1642425322 }, { value: 8, time: 1642511722 }, { value: 10, time: 1642598122 }, { value: 20, time: 1642684522 }, { value: 3, time: 1642770922 }, { value: 43, time: 1642857322 }, { value: 41, time: 1642943722 }, { value: 43, time: 1643030122 }, { value: 56, time: 1643116522 }, { value: 46, time: 1643202922 }];
  const [socket, setSocket] = useState<Socket | null>(null);
  const marketOpen = useRef<boolean>(false);

  useEffect(() => {
    if (!marketOpen.current) {
      //test if the market has opened
    }

    const socket = io();

    socket.on('connect', () => {
      console.log("Connection Established with Server.");
      setSocket(socket);
      setIsConnected(true);
    });

    socket.on('stock', (message: Stock) => {
      setStock(message);
    })

    socket.on('disconnect', () => {
      console.log("Socket Disconnected.");
    })

    return () => {
      socket.disconnect();
      setIsConnected(false);
    }
  }, []);

  return { stock, data, isConnected };

}
export default useSocketStock;
