# Zapp - A Minimalist Node.js Web Framework

Zapp is a lightweight web framework designed to simplify handling HTTP requests and responses. It provides a minimalistic API for defining routes, handling middleware, and managing request and response objects efficiently.

## Features

- Lightweight and minimalistic
- Middleware support
- Simple request and response handling
- JSON and text responses
- Static file serving

## Caution

- Middleware should only be used to modify the `req` or `res` object. Sending the response of the request back from middleware will cause the app to crash.
- The route handler should always return a response. Otherwise, the request will hang up and cause unintended consequences.
- Middleware are executed in order in which they are defined in code or usage.
- The library auto parses request body if it's `content-type` is `application/json` or `application/x-www-form-urlencoded`. For other's use middleware.

## Installation

Since this is a custom-built framework, simply include the `Zapp` class in your project and use it in your `server.js` file.

```javascript
import { Zapp } from "./modules/lib.js";
const app = new Zapp();

app.listen(3000, () => console.log("Server running on port 3000"));
```

---

## Usage

### Defining Routes

Zapp supports `GET` and `POST` methods for handling HTTP requests.

#### Handling GET Requests

```javascript
app.get("/hello", (req, res) => {
  res.text("Hello, World!");
});
```

#### Handling POST Requests

```javascript
app.post("/data", (req, res) => {
  res.json({ received: req.body });
});
```

---

## Middleware

Middleware functions allow modifying the `Request` and `Response` objects before the request reaches the route handler.

```javascript
app.use(async (req, res) => {
  console.log("Incoming request: ", req.method, req.url);
  req.user = { name: "John Doe" }; // Attach data to the request
});
```

---

## Request Object (`req`)

The `Request` object contains the following properties:

| Property  | Description                                          |
| --------- | ---------------------------------------------------- |
| `method`  | The HTTP method (e.g., `get`, `post`)                |
| `url`     | The requested URL pathname                           |
| `headers` | Request headers as an object                         |
| `params`  | URL parameters (if any)                              |
| `query`   | Parsed query parameters as an object                 |
| `body`    | Parsed request body (JSON, form-data, or plain text) |

Example:

```javascript
app.use(async (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Query Params:", req.query);
});
```

---

## Response Object (`res`)

The `Response` object provides methods to send responses back to the client:

| Method                           | Description                 |
| -------------------------------- | --------------------------- |
| `res.json(data, statusCode=200)` | Sends a JSON response       |
| `res.text(data, statusCode=200)` | Sends a plain text response |
| `res.serve(filePath)`            | Serves a static file        |

Example:

```javascript
app.get("/info", (req, res) => {
  res.json({ message: "Zapp Framework", version: "1.0" });
});
```

---

## Serving Static Files

Zapp allows serving static files such as HTML, CSS, and JavaScript.

```javascript
app.get("/index.html", (req, res) => {
  res.serve("./html/index.html");
});
```

---

## Error Handling

If a requested route is not found, Zapp automatically returns a `404 Not Found` response.

```javascript
Handler not found
```

---

## Conclusion

Zapp is a minimalist framework that simplifies handling HTTP requests with a straightforward API. It allows efficient middleware processing and response handling, making it a great alternative for lightweight applications.

Start building with Zapp today and enjoy its simplicity! 🚀
