'use client';
import React, { use, useEffect, useRef, useState } from 'react';


export default function StockQuotePage({ params }: { params: Promise<{ stock_name: string }> }) {

  const [isMarketOpen, setIsMarketOpen] = useState(null)

  useEffect(() => {
    async function fetchPosts() {
      const res = await fetch('/api/market-status')
      const data = await res.json()
      setIsMarketOpen(data.isOpen)
    }
    fetchPosts()
  }, [])

  // Mock News
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
  const { stock_name } = use(params);
  const stockData = {
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


  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Stock Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900">{stockData.name}</h1>
          {isMarketOpen ? (<p>Market Open</p>) : (<p>Market Closed</p>)}
          <div className="mt-2 flex items-baseline">
            <span className="text-4xl font-semibold">${stockData.price}</span>
            <span className={`ml-3 text-lg ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stockData.change >= 0 ? '+' : ''}{stockData.change} ({stockData.changePercent}%)
            </span>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="text-gray-500">Chart Component Will Go Here</span>
          </div>
        </div>

        {/* Stock Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Key Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm text-gray-500">Market Cap</h3>
              <p className="text-lg font-medium">{stockData.stats.marketCap}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">P/E Ratio</h3>
              <p className="text-lg font-medium">{stockData.stats.peRatio}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Volume</h3>
              <p className="text-lg font-medium">{stockData.stats.volume}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Avg. Volume</h3>
              <p className="text-lg font-medium">{stockData.stats.avgVolume}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Day Range</h3>
              <p className="text-lg font-medium">{stockData.stats.dayRange}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">52 Week Range</h3>
              <p className="text-lg font-medium">{stockData.stats.yearRange}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Dividend</h3>
              <p className="text-lg font-medium">{stockData.stats.dividend}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">EPS</h3>
              <p className="text-lg font-medium">{stockData.stats.eps}</p>
            </div>
          </div>
        </div>

        {/* More Stocks */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className='text-xl font-semibold mb-4'>More Stocks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          </div>
        </div>


        {/* Stock News */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className='text-xl font-semibold mb-4'>Related News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newsData.map((news) => {
              return (
                <a key={news.id} className='shadow-black rounded-md flex flex-col' href=''>
                  <h3 className='text-lg font-medium'>{news.title}</h3>
                  <p className='text-sm'>{news.desc.substring(0, 150)}...</p>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
