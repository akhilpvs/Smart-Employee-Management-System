UPDATE users SET password='$2a$10$UcW9F8leY.tTBA2eKJXXW.n6ucekfZ.dPS9VLSKee3avSPTQcuGGe' WHERE email='admin@company.com';
UPDATE users SET password='$2a$10$SgwdvAWUZBMukzXThTJSSOCgYWEu3NdEZ0.fMiEVjw9bTh66.Ge.O' WHERE email='john.doe@company.com';
UPDATE users SET password='$2a$10$u2bKkq5pDcCwvqoD2a3b.ua65qUX/h/ziErEhCy6m7pRtSfsikuRi' WHERE email='jane.smith@company.com';
SELECT id, email, LENGTH(password) as hash_length FROM users;
