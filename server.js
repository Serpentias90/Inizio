const express = require("express")
const axios = require("axios")

const app = express()

app.use(express.json())
app.use(express.static("."))

app.post("/search", async (req, res) => {

  try {

    const keyword = req.body.keyword

    const response = await axios.post(
      "https://google.serper.dev/search",
      {
        q: keyword,
        num: 10
      },
      {
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
          "Content-Type": "application/json"
        }
      }
    )

    console.log(response.data)

    const results = (response.data.organic || []).map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet
    }))

    res.json(results)

  } catch (error) {

    console.log("SERPER ERROR:", error.response?.data || error.message)

    res.json({
      error: error.response?.data || error.message,
      results: []
    })

  }

})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log("Server running")
})

module.exports = app
