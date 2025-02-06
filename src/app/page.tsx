"use client"

import { SearchBar } from "./components/SearchBar";
import { ActiveStocksTable } from "./components/ActiveStocksTable";
import { NewsSection } from "./components/NewsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-black">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Stock Market Visualizer</h1>

        <SearchBar />

        <ActiveStocksTable />

        <NewsSection />
      </div>
    </div>
  );
}
