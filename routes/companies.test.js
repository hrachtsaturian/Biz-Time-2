const { createData } = require("../testSamples");

const request = require("supertest");
const app = require("../app");
const db = require("../db");

beforeEach(createData);

afterAll(async () => {
  await db.end();
});

describe("GET /", () => {
  test("Get a list of companies", async () => {
    const response = await request(app).get("/companies");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      companies: [
        { code: "apple", name: "Apple" },
        { code: "ibm", name: "IBM" },
      ],
    });
  });
});

describe("GET /apple", () => {
  test("Get a specific company details", async () => {
    const response = await request(app).get("/companies/apple");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      company: {
        name: "Apple",
        code: "apple",
        industries: ["Technology"],
        description: "Maker of OSX.",
        invoices: [1, 2],
      },
    });
  });
});

describe("POST /", () => {
  test("Create a company", async () => {
    const response = await request(app).post("/companies").send({
      name: "Linux",
      description: "Maker of Linux OS.",
    });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      company: {
        code: "linux",
        name: "Linux",
        description: "Maker of Linux OS.",
      },
    });
  });
});

describe("PUT /apple", () => {
  test("Update the company info", async () => {
    const response = await request(app).put("/companies/apple").send({
      name: "Microsoft",
      description: "Maker of legendary Windows XP.",
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      company: {
        code: "apple",
        name: "Microsoft",
        description: "Maker of legendary Windows XP.",
      },
    });
  });
});

describe("DELETE /apple", () => {
  test("Delete the company", async () => {
    const response = await request(app).delete("/companies/apple");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "deleted" });
  });
});
