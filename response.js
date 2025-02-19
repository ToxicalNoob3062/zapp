import fs from "fs";
import path from "path";

const MIME_TYPES = {
  css: "text/css",
  gif: "image/gif",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "application/javascript",
  mjs: "application/javascript",
  json: "application/json",
  png: "image/png",
  svg: "image/svg+xml",
  txt: "text/plain",
};

export class Response {
  constructor(res) {
    this.res = res;
  }

  json(data, stausCode = 200) {
    this.res.writeHead(stausCode, { "Content-Type": "application/json" });
    this.res.end(JSON.stringify(data));
  }

  text(data, stausCode = 200) {
    this.res.writeHead(200, { "Content-Type": "text/plain" });
    this.res.end(data);
  }

  serve(filePath) {
    const contentType = this._getContentType(filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        this.res.writeHead(404, { "Content-Type": "text/plain" });
        this.res.end("File not found");
      } else {
        this.res.writeHead(200, { "Content-Type": contentType });
        this.res.end(data);
      }
    });
  }

  _extractExt(filename) {
    return path.extname(filename);
  }

  _getContentType(filename) {
    filename = filename.trim();
    let ext = this._extractExt(filename);
    return MIME_TYPES[ext.slice(1)] || "text/plain";
  }
}
