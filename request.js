import { StringDecoder } from "string_decoder";
import { URL } from "url";

export class Request {
  #rawRequest;

  constructor(req) {
    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    this.#rawRequest = req;
    this.method = req.method.toLowerCase();
    this.url = parsedUrl.pathname || "/";
    this.headers = req.headers;
    this.params = {};
    this.query = this._parseQuery();
    this.body = null;
  }

  static async create(req) {
    const request = new Request(req);
    request.body = await request._parseBody();
    return request;
  }

  _parseQuery() {
    const url = new URL(this.#rawRequest.url, `http://${this.headers.host}`);
    return Object.fromEntries(url.searchParams.entries());
  }

  _parseBody() {
    if (this.method === "GET") return Promise.resolve(null);

    const decoder = new StringDecoder("utf-8");
    let body = "";

    return new Promise((resolve, reject) => {
      this.#rawRequest.on("data", (chunk) => {
        body += decoder.write(chunk);
      });

      this.#rawRequest.on("end", () => {
        body += decoder.end();
        const contentType = this.headers["content-type"];

        try {
          switch (contentType) {
            case "application/json":
              resolve(JSON.parse(body));
              break;
            case "application/x-www-form-urlencoded":
              resolve(this._parseFormData(body));
              break;
            default:
              resolve(body);
          }
        } catch (error) {
          reject(new Error("Invalid JSON body"));
        }
      });

      this.#rawRequest.on("error", reject);
    });
  }

  _parseFormData(body) {
    return body.split("&").reduce((acc, pair) => {
      const [key, value] = pair.split("=");
      acc[decodeURIComponent(key)] = decodeURIComponent(value || "");
      return acc;
    }, {});
  }
}
