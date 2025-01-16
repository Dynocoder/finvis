import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface Stock {
  price: number,
  volume?: number
}

const useSocketStock = () => {
  const [stock, setStock] = useState<Stock | null>(null);
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
    });

    socket.on('stock', (message: Stock) => {
      setStock(message);
    })

    socket.on('disconnect', () => {
      console.log("Socket Disconnected.");
    })

    return () => {
      socket.disconnect();
    }
  }, []);

  return { stock };

}
export default useSocketStock;
