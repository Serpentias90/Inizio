const request = require("supertest")
const express = require("express")
const app = require("./server") 


describe("POST /search", () => {

  it("should return results array or error", async () => {

    const response = await request(app)
      .post("/search")
      .send({ keyword: "javascript tutorial" })
      .set("Accept", "application/json")
    
    expect(response.statusCode).toBe(200)
    
    expect(response.body).toHaveProperty("results")
    
    // results môže byť [] alebo obsahovať prvky
    expect(Array.isArray(response.body.results)).toBe(true)
    
    if(response.body.results.length > 0){
      const first = response.body.results[0]
      expect(first).toHaveProperty("title")
      expect(first).toHaveProperty("link")
      expect(first).toHaveProperty("snippet")
    }

  })

  const keywords = ["javascript", "nodejs tutorial", "express api"]

keywords.forEach(word => {
  it(`should return results for keyword: ${word}`, async () => {
    const response = await request(app)
      .post("/search")
      .send({ keyword: word })
      .set("Accept", "application/json")

    expect(response.statusCode).toBe(200)
    expect(response.body).toHaveProperty("results")
    expect(Array.isArray(response.body.results)).toBe(true)
  })
})

it("should handle empty keyword gracefully", async () => {
  const response = await request(app)
    .post("/search")
    .send({ keyword: "" })
    .set("Accept", "application/json")

  expect(response.statusCode).toBe(200)
  expect(response.body).toHaveProperty("results")
  expect(Array.isArray(response.body.results)).toBe(true)
})

it("should return error object when API fails", async () => {

  // tu môžeme dočasne zmeniť API URL alebo key
  const originalKey = process.env.SERPER_API_KEY
  process.env.SERPER_API_KEY = "invalid_key"

  const response = await request(app)
    .post("/search")
    .send({ keyword: "test" })
    .set("Accept", "application/json")

  expect(response.body).toHaveProperty("error")
  expect(Array.isArray(response.body.results)).toBe(true)

  process.env.SERPER_API_KEY = originalKey // vrátime key späť
})

})
