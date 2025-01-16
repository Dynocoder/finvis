import axios from "axios";
import { useEffect, useState } from "react"

const useMarketStatusFetcher = () => {
  const [isMarketOpen, setIsMarketOpen] = useState(null);

  useEffect(() => {
    const fetchMarketStatus = async () => {
      try {
        const { data } = await axios.get('/api/market-status');
        setIsMarketOpen(data.isOpen);
        if (data.isOpen) {
          console.log("The market is Open!");
        }
        else {
          console.log("The market is Open!");
        }
      } catch (err) {
        console.error(`Error fetching market status: ${err.message}`);
      }
    };

    fetchMarketStatus();
  }, []);

  return { isMarketOpen };
}

export default useMarketStatusFetcher;
