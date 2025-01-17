import { useEffect, useState } from "react"

const useMarketStatusFetcher = () => {
  const [isMarketOpen, setIsMarketOpen] = useState(null);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const res = await fetch('/api/market-status');
        const data = await res.json();
        setIsMarketOpen(data.isOpen);
      } catch (err) {
        console.log(`Error in getting Market Status: ${err}`);
      }
    };

    fetchMarketStatus();
  }, []);

  return { isMarketOpen };
}

export default useMarketStatusFetcher;
