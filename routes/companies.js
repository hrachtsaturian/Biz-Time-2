const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError");
const db = require("../db");

const router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { code, name } = req.query;
    const result = await db.query("SELECT code, name FROM companies;");
    return res.json({ companies: result.rows });
  } catch (err) {
    return next(err);
  }
});

router.get("/:code", async (req, res, next) => {
  try {
    const { code, name, description } = req.query;
    const result = await db.query(
      "SELECT code, name, description FROM companies WHERE code = $1;",
      [req.params.code]
    );

    const invResult = await db.query(
      "SELECT id FROM invoices WHERE comp_code = $1;",
      [req.params.code]
    );

    const indResult = await db.query(
      "SELECT c.name AS company_name, i.industry AS industry_name " + 
      "FROM companies c " +
      "JOIN companies_industries ci ON c.code = ci.company_code " +
      "JOIN industries i ON ci.industry_code = i.code " +
      "WHERE c.code = $1;", [req.params.code]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Invalid company: ${req.params.code}`, 404);
    }

    const company = result.rows[0];
    const invoices = invResult.rows;
    const industries = indResult.rows;


    company.invoices = invoices.map((inv) => inv.id);
    company.industries = industries.map((ind) => ind.industry_name);

    return res.json({ company: company });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let { name, description } = req.body;
    let code = slugify(name, {lower: true});
    const result = await db.query(
      "INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description;",
      [code, name, description]
    );
    return res.status(201).json({ company: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

router.put("/:code", async (req, res, next) => {
  try {
    let { name, description } = req.body;

    const result = await db.query(
      "UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description;",
      [name, description, req.params.code]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Invalid company: ${req.params.code}`, 404);
    } else {
      return res.json({ company: result.rows[0] });
    }
  } catch (err) {
    next(err);
  }
});

// companies_industries route
router.post("/:company_code/industry", async (req, res, next) => {
  try {
    const { industry_code } = req.body;
    const { company_code } = req.params;

    const result = await db.query(
    "INSERT INTO companies_industries (company_code, industry_code) VALUES ($1, $2) RETURNING company_code, industry_code",
      [company_code, industry_code]
    );
    return res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
});

router.delete("/:code", async (req, res, next) => {
  try {
    const result = await db.query(
      "DELETE FROM companies WHERE code=$1 RETURNING code;",
      [req.params.code]
    );

    if (result.rows.length === 0) {
      throw new ExpressError(`Invalid company: ${req.params.code}`, 404);
    } else {
      return res.json({ status: "deleted" });
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
