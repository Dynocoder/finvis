import { useEffect } from "react"

export function useNewsDataFetcher(stockName: string) {

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
  return { newsData };

}
