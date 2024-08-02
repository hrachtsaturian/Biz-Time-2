const express = require("express");
const db = require("../db");

const router = new express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await db.query(
      "SELECT i.code AS industry_code, i.industry AS industry_name, JSON_AGG(c.code) AS companies " +
        "FROM industries i " +
        "JOIN companies_industries ci ON i.code = ci.industry_code " +
        "JOIN companies c ON c.code = ci.company_code " +
        "GROUP BY i.code;"
    );
    return res.json({ industries: result.rows });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    let { code, industry } = req.body;
    const result = await db.query(
      "INSERT INTO industries (code, industry) VALUES ($1, $2 ) RETURNING code, industry;",
      [code, industry]
    );
    return res.status(201).json({ industry: result.rows[0] });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
