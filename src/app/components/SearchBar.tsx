import type React from "react"
import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { redirect } from "next/navigation";

interface SearchResult {
  symbol: string;
  longName: string
}

export function SearchBar({ props }: any) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("handle?")
  }



  useEffect(() => {
    if (query.length > 0) {
      fetch(`/api/search/${query}`)
        .then(res => res.json())
        .then((data: SearchResult[]) => {
          setResults(data);
          console.log(results);
          setShowResults(data.length > 0);
        })
        .catch((err) => {
          console.log(`Error: ${err}`)
          setResults([])
          setShowResults(false);
        });
    }
    else {
      setResults([])
      setShowResults(false);

    }
  }, [query])

  const handleResultClick = (quote: SearchResult) => {

    redirect(`/quotes/${quote.symbol}`)
  }


  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          placeholder="Search for an equity..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <Search className="h-5 w-5 text-gray-400" />
        </button>
      </form>
      {showResults && results.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {results.map((quote) => (
            <div
              key={quote.symbol}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleResultClick(quote)}
            >
              <div className="flex justify-between">
                <span className="font-bold">{quote.symbol}</span>
              </div>
              <div className="text-sm text-gray-500">{quote.longName}</div>
            </div>
          ))}
        </div>
      )}
    </div>

  )
}

