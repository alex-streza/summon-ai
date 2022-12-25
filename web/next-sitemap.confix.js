/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.VERCEL_URL || "https://www.summon-ai.com",
  generateRobotsTxt: true,
};
