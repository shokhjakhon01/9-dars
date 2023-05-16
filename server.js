const http = require("http");
const { read, write, hashPassword } = require("./utils/model");
const Express = require("./lib/express");

function httpServer(req, res) {
  const app = new Express(req, res);

  app.get("/users", (req, res) => {
    const data = read("users").filter((pass) => delete pass.password);
    const { gender } = req.query;
    const filtered = data.filter((user) => user.gender === gender);

    if (filtered.length) {
      res.setHeader("Content-type", "application/json");
      res.end(JSON.stringify(filtered));
    } else {
      res.setHeader("Content-type", "application/json");
      res.end(JSON.stringify(data));
    }
  });

  app.post("/signup", async (req, res) => {
    try {
      const users = read("users");
      let { password, gender, username } = await req.body;

      if (!users.includes(username)) {
        throw new Error("Invalid username");
      }
      password = hashPassword(password);
      const newUser = {
        userId: users.at(-1).userId + 1 || 1,
        password,
        gender,
        username,
      };
      users.push(newUser);
      write("users", users);
      res.writeHead(201, { "Content-type": "application/json" });
      res.end(JSON.stringify({ status: 201, success: true }));
    } catch (error) {
      res.writeHead(400, { "Content-type": "application/json" });
      res.end(JSON.stringify({ status: 400, message: error.message }));
    }
  });

  app.post("/signin", async (req, res) => {
    const users = read("users");
    try {
      let { username, password } = await req.body;
      password = hashPassword(password);
      const user = users.find(
        (user) => user.username == username && user.password === password
      );

      if (!user) {
        throw new Error("Wrong password or username");
      }
      res.writeHead(200, { "Content-type": "application/json" });
      res.end(JSON.stringify({ status: 200, success: true }));
    } catch (error) {
      res.writeHead(400, { "Content-type": "application/json" });
      res.end(JSON.stringify({ status: 400, message: error.message }));
    }
  });
}

http
  .createServer(httpServer)
  .listen(5000, () => console.log("server running on port" + 5000));
