import React from "react"
import Link from "next/link"

// This would typically come from an API or state management
const mockActiveStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 150.25, change: 2.5, changePercent: 1.69 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 2750.8, change: -15.2, changePercent: -0.55 },
  { symbol: "MSFT", name: "Microsoft Corporation", price: 305.75, change: 3.25, changePercent: 1.07 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 3380.5, change: -22.75, changePercent: -0.67 },
  { symbol: "Meta", name: "Meta Platforms Inc.", price: 325.45, change: 5.8, changePercent: 1.81 },
]

export function ActiveStocksTable() {


  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000';

  // const fetchStaticStockData = async (stockName: string) => {
  //   try {
  //     const res = await fetch(`${baseUrl}/api/stock/${stockName}`);
  //     const data = await res.json();
  //     return data;
  //   } catch (err) {
  //     console.log(`Error in getting Static Data: ${err}`);
  //     return null;
  //   }
  // };
  const fetchTrendingSymbols = async () => {
    try {
      return fetch(`${baseUrl}/api/trending`).then((res) => res.json()).then((data) => data);
    } catch (err) {
      console.log(`Error in getting Static Data: ${err}`);
      return null;
    }
  }

  const activeStocks = fetchTrendingSymbols().then((data) => console.log(`hehe ${JSON.stringify(data)}`));

  // console.log("active stonks");
  // console.log(activeStocks)



  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Most Active Stocks</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-2">Symbol</th>
              <th className="pb-2 hidden md:block">Name</th>
              <th className="pb-2 text-right">Price</th>
              <th className="pb-2 text-right hidden md:block">Change</th>
              <th className="pb-2 text-right">% Change</th>
            </tr>
          </thead>
          <tbody>
            {mockActiveStocks.map((stock) => (
              <tr key={stock.symbol} className="border-b last:border-b-0">
                <td className="py-3">
                  <Link href={`/quotes/${stock.symbol}`} className="text-blue-600 hover:underline">
                    {stock.symbol}
                  </Link>
                </td>
                <td className="py-3 hidden md:block">{stock.name}</td>
                <td className="py-3 text-right">${stock.price.toFixed(2)}</td>
                <td className={`py-3 text-right hidden md:block ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stock.change >= 0 ? "+" : ""}
                  {stock.change.toFixed(2)}
                </td>
                <td className={`py-3 text-right ${stock.changePercent >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

