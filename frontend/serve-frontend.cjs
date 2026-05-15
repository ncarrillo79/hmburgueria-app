const http = require("http");
const handler = require("serve-handler");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
  handler(req, res, {
    public: path.join(__dirname, "dist"),
    rewrites: [{ source: "**", destination: "/index.html" }],
  });
});

server.listen(PORT, () => {
  console.log("Frontend corriendo en http://localhost:" + PORT);
});
