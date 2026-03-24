const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

app.use(express.json())
app.use(express.static("."))

app.post("/search", async (req, res) => {

    const keyword = req.body.keyword
    const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=10`

  const response = await axios.get(url, {
  headers: {
    "User-Agent": "Mozilla/5.0",
    "Accept-Language": "en-US,en;q=0.9"
  },
  validateStatus: () => true
})

    const $ = cheerio.load(response.data)

    let results = []
if (response.data.includes("sorry/index")) {
  return res.json({
    error: "Google blocked the request",
    results: []
  })
}
    $("div.g").each((i, el) => {

        const title = $(el).find("h3").text()
        const link = $(el).find("a").attr("href")
        const snippet = $(el).find(".VwiC3b").text()

        if (title && link) {
            results.push({
                title,
                link,
                snippet
            })
        }
    })

    res.json(results)
})

app.listen(3000, () => {
    console.log("Server running")
})
