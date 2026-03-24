const { extractResults } = require("./parser")

test("should return valid results structure", () => {

    const mockHTML = `
    <div class="g">
        <h3>Example title</h3>
        <a href="https://example.com"></a>
        <div class="VwiC3b">Example snippet</div>
    </div>
    `

    const results = extractResults(mockHTML)

    expect(results.length).toBe(1)

    expect(results[0]).toHaveProperty("title")
    expect(results[0]).toHaveProperty("link")
    expect(results[0]).toHaveProperty("snippet")
})