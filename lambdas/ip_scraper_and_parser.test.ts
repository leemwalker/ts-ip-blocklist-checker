import rewire from "rewire"
const ip_scraper_and_parser = rewire("./ip_scraper_and_parser")
const pullFromRepo = ip_scraper_and_parser.__get__("pullFromRepo")
const chainResults = ip_scraper_and_parser.__get__("chainResults")
// @ponicode
describe("pullFromRepo", () => {
    test("0", async () => {
        let result: any = await pullFromRepo("https://api.telegram.org/")
        expect(result).toMatchSnapshot()
        expect(result).toBe("200")
    })

    test("1", async () => {
        let result: any = await pullFromRepo("https://croplands.org/app/a/confirm?t=")
        expect(result).toMatchSnapshot()
        expect(result).toBe("200")
    })

    test("2", async () => {
        let result: any = await pullFromRepo("https://croplands.org/app/a/reset?token=")
        expect(result).toMatchSnapshot()
        expect(result).toBe("200")
    })

    test("3", async () => {
        let result: any = await pullFromRepo("https://")
        expect(result).toMatchSnapshot()
        expect(result).toBe("200")
    })

    test("4", async () => {
        let result: any = await pullFromRepo("www.google.com")
        expect(result).toMatchSnapshot()
        expect(result).toBe("200")
    })

    test("5", async () => {
        let result: any = await pullFromRepo("")
        expect(result).toMatchSnapshot()
        expect(result).toBe("200")
    })

    test("6", async () => {
        let result: any = await pullFromRepo("https://github.com/firehol/blocklist-ipsets")
        expect(result).toBe("Error: rate limit exceeded")
        expect(result).toMatchSnapshot()
    })

    test("7", async () => {
        await pullFromRepo("http://www.croplands.org/account/confirm?t=")
    })

    test("8", async () => {
        await pullFromRepo("https://accounts.google.com/o/oauth2/revoke?token=%s")
    })

    test("9", async () => {
        await pullFromRepo("https://twitter.com")
    })

    test("10", async () => {
        await pullFromRepo(":https://")
    })

    test("11", async () => {
        await pullFromRepo("https://twitter.com/path?abc")
    })
})

// @ponicode
describe("chainResults", () => {
    test("0", async () => {
        let result: any = await chainResults("https://api.github.com/repositories/35515847/git/trees/master?recursive=1")
        expect(result).toBe("Error: rate limit exceeded")
    })

    test("1", async () => {
        await chainResults("ponicode.com")
    })
})
