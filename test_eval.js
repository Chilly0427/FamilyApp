const { JSDOM } = require("jsdom");
const fs = require("fs");
const html = fs.readFileSync("public/zaiko.html", "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously" });
console.log("JSDOM loaded.");

