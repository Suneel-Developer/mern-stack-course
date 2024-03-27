const http = require("http");
const port = 4000;

const server = http.createServer((req, res) => {
  console.log(server.url);
});

server.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});


