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

})
