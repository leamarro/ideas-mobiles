/** @type {import('eslint').Linter.Config} */
const config = {
  rules: {
    "no-unused-vars": "warn",
    "@next/next/no-html-link-for-pages": "off",
  },
  ignores: ["node_modules/", ".next/", "out/", "prisma/"],
};

module.exports = config;
