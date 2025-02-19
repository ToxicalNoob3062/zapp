import { Request } from "./request.js";
import { Response } from "./response.js";
import http from "http";

export class Zapp {
  server = null;
  middlewares = [];
  register = {};
  constructor() {
    this.server = http.createServer(async (req, res) => {
      const request = await Request.create(req);
      const response = new Response(res);
      //call all the middlewares with request and response
      for (let middleware of this.middlewares) {
        await middleware(request, response);
      }
      //form the key
      let key = request.method + ":" + request.url;

      //call the callback if exists otherwise log error hanlder not found
      if (this.register[key]) {
        await this.register[key](request, response);
      } else {
        console.log("Handler not found");
        response.text("Not Found", 404);
      }
    });
  }
  use(middleware) {
    this.middlewares.push(middleware);
  }
  listen(port, callback = () => {}) {
    this.server.listen(port, callback);
  }
  get(path, callback) {
    path = "get:" + path;
    this.register[path] = callback;
  }
  post(path, callback) {
    path = "post:" + path;
    this.register[path] = callback;
  }
}
