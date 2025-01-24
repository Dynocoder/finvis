'use client'
import React, { useEffect, useRef, useState } from 'react';
import { AreaData, createChart, IChartApi, ISeriesApi, TickMarkType, Time, UTCTimestamp } from 'lightweight-charts';
import useSocketStock from '@/app/hooks/useSocketStocks';

interface StockParams {
  stockData: any,
  stockSeries: AreaData[],
  newsData: Array<any>,
  isMarketOpen: boolean,
}

export interface PriceData {
  price: number,
  change: number,
  changePercent: number,
  time: UTCTimestamp,
}


export default function QuotePage(params: StockParams) {

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  const { stock } = useSocketStock(params.stockData.displayName, params.stockData);

  const formatter = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 2,
  });

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  })

  const chartOptions: any = {
    timeScale: {
      timeVisible: true,
      secondsVisible: false,
      timeUnit: 'hour',
    },
    layout: {
      textColor: 'black',
      background: {
        type: 'solid', color: 'white'
      }
    }
  };

  useEffect(() => {
    if (chartContainerRef.current) {
      const chart = createChart(chartContainerRef.current, {
        handleScale: false,
        handleScroll: false,
        timeScale: {
          visible: true,
          timeVisible: true,
          secondsVisible: false,
          fixLeftEdge: true,
          fixRightEdge: true,
          // lockVisibleTimeRangeOnResize: true,
          tickMarkFormatter: (time: Time, tickMarkType: TickMarkType, locale: string) => {
            return new Date((time as number) * 1000).toLocaleString('en-US', { hour: 'numeric', hour12: true });
          },
        },
        crosshair: {
          vertLine: {
            labelVisible: true,
          },
        },
        leftPriceScale: {
          visible: true,
          textColor: 'black',
        },
        rightPriceScale: {
          visible: false,
        },
        layout: {
          textColor: 'black',
        }
      });


      const lineSeries = chart.addAreaSeries();


      lineSeries.setData(params.stockSeries);
      chart.timeScale().fitContent();
      chartRef.current = chart;
      seriesRef.current = lineSeries;

      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
          });

          // Re-fit content after resize
          chartRef.current.timeScale().fitContent();
        }
      };

      window.addEventListener('resize', handleResize);

      return () => {
        chart.remove();
        window.removeEventListener('resize', handleResize);
      }
    }

  }, []);

  useEffect(() => {
    if (!seriesRef.current || !chartRef.current) return;

    document.querySelector('#tv-attr-logo')?.remove(); // this removes the logo
    seriesRef.current.update({ value: stock.price, time: stock.time })
    chartRef.current.timeScale().fitContent();


    const start = new Date(params.stockData.regularMarketTime).setHours(9, 30, 0, 0) / 1000 as Time;
    const stop = new Date(params.stockData.regularMarketTime).setHours(16, 0, 0, 0) / 1000 as Time;

    chartRef.current.timeScale().setVisibleLogicalRange({
      from: 0,
      to: params.stockSeries.length
    })

  }, [stock])

  const prettyPrint = (val: any, formatter?: any) => {
    if (val) {
      try {
        if (formatter) {
          const formatted = formatter(val);
          return formatted;
        }
        return val;
      }
      catch (err) {
        console.log(`Error ${err}`)
      }
    }
    return "--";
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black" >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stock Header Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-3xl font-bold text-gray-900">{params.stockData.longName} ({params.stockData.symbol})</h1>
          <div className="mt-2 flex items-baseline">
            <span className="text-4xl font-semibold">${stock!.price}</span>
            <span className={`ml - 3 text - lg ${stock!.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stock!.change >= 0 ? '+' : ''}{stock!.change} ({stock!.changePercent}%)
            </span>
          </div>
          <div className='mt-2 flex flex-row items-baseline'>
            {params.isMarketOpen ? (
              <></>
            ) : (
              <p className='text-sm font-medium text-gray-500'>At Close</p>
            )}
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Price Chart</h2>
          <div ref={chartContainerRef} className="h-96 bg-gray-100 rounded-lg flex items-center justify-center"></div>
        </div>

        {/* Stock Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Key Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm text-gray-500">Previous Close</h3>
              <p className="text-lg font-medium">{prettyPrint(params.stockData.regularMarketPreviousClose, currencyFormatter.format)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Market Cap</h3>
              <p className="text-lg font-medium">{prettyPrint(params.stockData.marketCap, formatter.format)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">P/E Ratio (TTM)</h3>
              <p className="text-lg font-medium">{prettyPrint(params.stockData.trailingPE, (a: any) => { return Math.floor(a * 100) / 100 })}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Volume</h3>
              {/* TODO: update to realtime volume. */}
              <p className="text-lg font-medium">{prettyPrint(params.stockData.regularMarketVolume, new Intl.NumberFormat().format)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Avg. Volume</h3>
              <p className="text-lg font-medium">{prettyPrint(params.stockData.regularMarketVolume, new Intl.NumberFormat().format)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Day Range</h3>
              <p className="text-lg font-medium">{prettyPrint(params.stockData.regularMarketDayRange.low, currencyFormatter.format)} - {prettyPrint(params.stockData.regularMarketDayRange.high, currencyFormatter.format)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">52 Week Range</h3>
              <p className="text-lg font-medium">{prettyPrint(params.stockData.fiftyTwoWeekRange.low)} - {prettyPrint(params.stockData.fiftyTwoWeekRange.low)}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">Forward Dividend & Yield</h3>
              <p className="text-lg font-medium">{prettyPrint(params.stockData.dividendYield, (a: any) => { return a + '%' })}</p>
            </div>
            <div>
              <h3 className="text-sm text-gray-500">EPS (TTM)</h3>
              <p className="text-lg font-medium">{prettyPrint(params.stockData.epsTrailingTwelveMonths)}</p>
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
