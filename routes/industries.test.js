const { createData } = require("../testSamples");

const request = require("supertest");
const app = require("../app");
const db = require("../db");

beforeEach(createData);

afterAll(async () => {
  await db.end();
});

describe("GET /industries", () => {
  test("Should return a list of industries with their companies", async () => {
    const res = await request(app).get("/industries");
    expect(res.statusCode).toEqual(200);
    expect(res.body.industries).toBeInstanceOf(Array);
  });
});

describe("POST /industries", () => {
  test("should create a new industry", async () => {
    const newIndustry = { code: "test", industry: "Test Industry" };
    const res = await request(app).post("/industries").send(newIndustry);
    expect(res.statusCode).toEqual(201);
    expect(res.body.industry).toHaveProperty("code", newIndustry.code);
    expect(res.body.industry).toHaveProperty("industry", newIndustry.industry);
  });
});
