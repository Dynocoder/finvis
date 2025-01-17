import React, { Suspense } from 'react';
import QuotePage from './StockQuotePage';

export default async function StockQuotePage({ params,
}: {
  params: Promise<{ stock_name: string }>
}) {

  const stock_name = (await params).stock_name;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';
  // const { newsData } = useNewsDataFetcher(stock_name);


  const fetchStaticStockData = async (stockName: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/stock/${stockName}`);
      const data = await res.json();
      console.log(data);
      return data;
    } catch (err) {
      console.log(`Error in getting Static Data: ${err}`);
      return null;
    }
  };


  const fetchMarketStatus = async () => {
    try {
      const res = await fetch('/api/market-status');
      const data = await res.json();
      return data.isOpen;
    } catch (err) {
      console.log(`Error in getting Market Status: ${err}`);
      return null;
    }
  };

  // isMarketOpen = await fetchMarketStatus();

  const stockData = await fetchStaticStockData(stock_name);
  console.log("displaName: ", stockData.displayName);

  const newsData = [
    {
      id: 1,
      title: "AAPL announces new smartphone Tech",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam totam beatae vitae, tenetur eaque optio. Autem placeat culpa aperiam iusto necessitatibus, quaerat cum. Consectetur id rem eos itaque, soluta expedita."
    },
    {
      id: 2,
      title: "AAPL China clash continues",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam totam beatae vitae, tenetur eaque optio. Autem placeat culpa aperiam iusto necessitatibus, quaerat cum. Consectetur id rem eos itaque, soluta expedita."
    },
    {
      id: 3,
      title: "AAPL fined $3B",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam totam beatae vitae, tenetur eaque optio. Autem placeat culpa aperiam iusto necessitatibus, quaerat cum. Consectetur id rem eos itaque, soluta expedita."
    },
    {
      id: 4,
      title: "AAPL partners with google",
      desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam totam beatae vitae, tenetur eaque optio. Autem placeat culpa aperiam iusto necessitatibus, quaerat cum. Consectetur id rem eos itaque, soluta expedita."
    }
  ]

  // Mock data - replace with actual API calls
  const stockDataMock: any = {
    displayName: 'Apple. ',
    name: stock_name.toUpperCase(),
    price: 150.25,
    change: +2.5,
    changePercent: +1.67,
    stats: {
      marketCap: '2.5T',
      peRatio: 25.4,
      volume: '52.3M',
      avgVolume: '48.1M',
      dayRange: '148.75 - 151.34',
      yearRange: '125.52 - 165.23',
      dividend: '0.88 (0.59%)',
      eps: 6.05,
    }
  };

  const props = {
    stockData: stockData,
    newsData: newsData,
    isMarketOpen: true
  }

  return (
    <Suspense>
      <QuotePage {...props} />
    </Suspense>
  );
};
