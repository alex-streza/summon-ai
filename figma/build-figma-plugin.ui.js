const env = JSON.stringify(require("dotenv").config().parsed);

module.exports = (buildOptions) => ({
  ...buildOptions,
  define: {
    "process.env": env,
  },
});
