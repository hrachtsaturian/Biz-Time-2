\c biztime

DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS industries_companies;



CREATE TABLE companies (
    code text PRIMARY KEY,
    name text NOT NULL UNIQUE,
    description text
);

CREATE TABLE invoices (
    id serial PRIMARY KEY,
    comp_code text NOT NULL REFERENCES companies ON DELETE CASCADE,
    amt float NOT NULL,
    paid boolean DEFAULT false NOT NULL,
    add_date date DEFAULT CURRENT_DATE NOT NULL,
    paid_date date,
    CONSTRAINT invoices_amt_check CHECK ((amt > (0)::double precision))
);

CREATE TABLE industries (
    code text PRIMARY KEY,
    industry text NOT NULL UNIQUE,
);

CREATE TABLE companies_industries (
    company_code text NOT NULL,
    industry_code text NOT NULL,
    PRIMARY KEY (company_code, industry_code),
    FOREIGN KEY (company_code) REFERENCES companies(code) ON DELETE CASCADE,
    FOREIGN KEY (industry_code) REFERENCES industries(code) ON DELETE CASCADE
);



INSERT INTO companies
  VALUES ('apple', 'Apple Computer', 'Maker of OSX.'),
         ('ibm', 'IBM', 'Big blue.');

INSERT INTO invoices (comp_Code, amt, paid, paid_date)
  VALUES ('apple', 100, false, null),
         ('apple', 200, false, null),
         ('apple', 300, true, '2018-01-01'),
         ('ibm', 400, false, null);

INSERT INTO industries (code, industry) VALUES
('I1', 'Technology'),
('I2', 'Energy'),
('I3', 'Healthcare'),
('I4', 'Renewable Energy');

INSERT INTO companies_industries (company_code, industry_code) VALUES
('apple', 'I1'),
('ibm', 'I1');