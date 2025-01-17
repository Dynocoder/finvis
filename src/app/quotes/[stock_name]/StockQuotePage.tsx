'use client'
import React, { use, useEffect, useState } from 'react';
import { createChart } from 'lightweight-charts';
import { useNewsDataFetcher } from '@/app/hooks/useNewsDataFetcher';
import useSocketStock, { Stock } from '@/app/hooks/useSocketStocks';
import useMarketStatusFetcher from '@/app/hooks/useMarketStatusFetcher';
import { useStaticStockData } from '@/app/hooks/useStaticStockData';

interface StockParams {
  stockData: any,
  newsData: Array<any>,
  isMarketOpen: boolean,
}

interface PriceData {
  price: number,
  change: number,
  changePercent: number
}

export default function QuotePage(params: StockParams) {
  const { isConnected, data } = useSocketStock(params.stockData.displayName);
  const [lineSeries, setLineSeries] = useState<any>();
  const [priceData, setPriceData] = useState<PriceData>(setInitialPriceData());
  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  });
  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })
  const chartOptions: any = { layout: { textColor: 'black', background: { type: 'solid', color: 'white' } } };

  function setInitialPriceData() {
    if (isConnected && params.isMarketOpen) {
      const data: PriceData = {
        price: 150.26,
        change: 4.3,
        changePercent: 2.8
      }
      return data;
    }
    else {
      const data: PriceData = {
        price: params.stockData.regularMarketPrice,
        change: Math.floor(params.stockData.regularMarketChange * 100) / 100,
        changePercent: Math.floor(params.stockData.regularMarketChangePercent * 100) / 100,
      }
      return data;
    }
  }


  useEffect(() => {
    const element = document.getElementById('container') ?? '';
    if (element === '') return;
    const chart = createChart(element, chartOptions);
    const lineSeries: any = chart.addAreaSeries();
    setLineSeries(lineSeries)

    lineSeries.setData(data);
    chart.timeScale().fitContent();
    document.querySelector('#tv-attr-logo')?.remove();
  }, [])


  // Mock data - replace with actual API calls
  const stockDataMock = {
    name: params.stockData.displayName,
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

  const addDataHandler = () => {
    const cur = new Date();
    const a = cur.getTime()
    if (lineSeries) {
      lineSeries.update({ value: 8, time: a })
    }
  }

  const isSocketConnected = (): boolean => {
    return isConnected && data.length > 0;
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black" >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stock Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900">{params.stockData.longName} ({params.stockData.symbol})</h1>
          <div className="mt-2 flex items-baseline">
            <span className="text-4xl font-semibold">${priceData.price}</span>
            <span className={`ml-3 text-lg ${priceData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {priceData.change >= 0 ? '+' : ''}{priceData.change} ({priceData.changePercent}%)
            </span>
          </div>
          <div className='mt-2 flex flex-row items-baseline'>
            {params.isMarketOpen ? (
              <p className='text-sm font-medium text-gray-500'>At Close</p>
            ) : (
              <p className='text-sm font-medium text-gray-500'></p>
            )}
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
          <div id="container" className="h-96 bg-gray-100 rounded-lg flex items-center justify-center"></div>
        </div>

        {/* Stock Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Key Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm text-gray-500">Previous Close</h3>
              <p className="text-lg font-medium">{currencyFormatter.format(params.stockData.regularMarketPreviousClose)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Market Cap</h3>
              <p className="text-lg font-medium">{formatter.format(params.stockData.marketCap)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">P/E Ratio (TTM)</h3>
              <p className="text-lg font-medium">{Math.floor(params.stockData.trailingPE * 100) / 100}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Volume</h3>
              {/* TODO: update to realtime volume. */}
              <p className="text-lg font-medium">{new Intl.NumberFormat().format(params.stockData.regularMarketVolume)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Avg. Volume</h3>
              <p className="text-lg font-medium">{new Intl.NumberFormat().format(params.stockData.regularMarketVolume)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Day Range</h3>
              <p className="text-lg font-medium">{currencyFormatter.format(params.stockData.regularMarketDayRange.low)} - {currencyFormatter.format(params.stockData.regularMarketDayRange.high)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">52 Week Range</h3>
              <p className="text-lg font-medium">{params.stockData.fiftyTwoWeekRange.low} - {params.stockData.fiftyTwoWeekRange.high}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Forward Dividend & Yield</h3>
              <p className="text-lg font-medium">{params.stockData.dividendYield}%</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">EPS (TTM)</h3>
              <p className="text-lg font-medium">{params.stockData.epsTrailingTwelveMonths}</p>
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
            {params.newsData.map((news: any) => {
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
