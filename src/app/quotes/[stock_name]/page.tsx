import React, { Suspense } from 'react';
import QuotePage from './StockQuotePage';

export default async function StockQuotePage({ params,
}: {
  params: Promise<{ stock_name: string }>
}) {

  const stock_name = (await params).stock_name;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  const fetchStaticStockData = async (stockName: string) => {
    try {
      const res = await fetch(`${baseUrl}/api/stock/${stockName}`);
      const data = await res.json();
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

  const props = {
    stockData: stockData.quote,
    stockSeries: stockData.filtered_series,
    newsData: newsData,
    isMarketOpen: true
  }

  console.log("From Server Component: ")
  console.log(props)

  return (
    <QuotePage {...props} />
  );
};
