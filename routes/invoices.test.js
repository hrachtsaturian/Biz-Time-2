const { createData } = require("../testSamples");

const request = require("supertest");
const app = require("../app");
const db = require("../db");

beforeEach(createData);

afterAll(async () => {
  await db.end();
});

describe("GET /", () => {
  test("Get a list of invoices", async () => {
    const response = await request(app).get("/invoices");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      invoices: [
        { id: 1, comp_code: "apple" },
        { id: 2, comp_code: "apple" },
        { id: 3, comp_code: "ibm" },
      ],
    });
  });
});

describe("GET /1", () => {
  test("Get a specific invoice details", async () => {
    const response = await request(app).get("/invoices/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      invoice: {
        id: 1,
        company: {
          code: "apple",
          name: "Apple",
          description: "Maker of OSX.",
        },
        amt: 100,
        paid: false,
        add_date: "2018-01-01T08:00:00.000Z",
        paid_date: null,
      },
    });
  });
});

describe("POST /", () => {
  test("Create an invoice", async () => {
    const response = await request(app).post("/invoices").send({
      comp_code: "apple",
      amt: 777,
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      invoice: {
        id: 4,
        comp_code: "apple",
        amt: 777,
        add_date: expect.any(String),
        paid: false,
        paid_date: null,
      },
    });
  });
});

describe("DELETE /1", () => {
  test("Delete the invoice", async () => {
    const response = await request(app).delete("/invoices/1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "deleted" });
  });
});
