import React from "react"

// This would typically come from an API
const mockNews = [
  {
    id: 1,
    title: "Tech Stocks Surge Amid Positive Earnings Reports",
    desc: "Major tech companies exceed expectations in Q2 earnings, driving market optimism.",
  },
  {
    id: 2,
    title: "Federal Reserve Hints at Potential Rate Hike",
    desc: "Investors brace for possible changes in monetary policy as Fed officials discuss economic outlook.",
  },
  {
    id: 3,
    title: "New Green Energy ETF Launches, Attracts Investors",
    desc: "Sustainable investing gains traction with the introduction of a highly anticipated green energy fund.",
  },
]

export function NewsSection() {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Latest Market News</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockNews.map((news) => (
          <a key={news.id} href="#" className="block p-4 border rounded-lg hover:shadow-md transition-shadow">
            <h3 className="text-lg font-medium mb-2">{news.title}</h3>
            <p className="text-sm text-gray-600">{news.desc}</p>
          </a>
        ))}
      </div>
    </div>
  )
}

