const fs = require("fs");
const { app } = require("electron");

module.exports = () => {
  const storageStateDir = `${app.getPath("userData")}/cache/storageState`;

  const paths = fs.readdirSync(storageStateDir);

  const storageStates = paths.map((p) => {
    return JSON.parse(fs.readFileSync(`${storageStateDir}/${p}`, "utf-8"));
  });

  const merged = { cookies: [], origins: [] };

  for (const state of storageStates) {
    if (state.cookies) merged.cookies.push(...state.cookies);
    if (state.origins) merged.origins.push(...state.origins);
  }

  return merged;
};
