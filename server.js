const express = require("express")
const axios = require("axios")
const cheerio = require("cheerio")

const app = express()

app.use(express.json())
app.use(express.static("."))

app.post("/search", async (req, res) => {

  try {

    const keyword = req.body.keyword

    const url = `https://www.google.com/search?q=${encodeURIComponent(keyword)}&num=10&hl=en`

    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1"
      },
      timeout: 5000,
      validateStatus: () => true
    })

    // ak Google blokuje request
    if (response.data.includes("/sorry/")) {
      return res.json({
        error: "Google blocked the request",
        results: []
      })
    }

    const $ = cheerio.load(response.data)

    let results = []

    $("div.g").each((i, el) => {

      const title = $(el).find("h3").first().text()
      const link = $(el).find("a").first().attr("href")
      const snippet = $(el).find(".VwiC3b, .IsZvec").first().text()

      if (title && link && link.startsWith("http")) {
        results.push({
          title,
          link,
          snippet
        })
      }

    })

    res.json(results)

  } catch (error) {

    console.error("Search error:", error.message)

    res.status(500).json({
      error: "Search failed",
      results: []
    })

  }

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running on port", PORT)
})
