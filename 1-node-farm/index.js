// get access to the file system
const fs = require("fs");
const http = require("http"); // networking capabilites
const url = require("url");

const slugify = require("slugify");

const replaceTemplate = require("./modules/replaceTemplate");

//////////////////////////////
// FILES

// // Blocking, synchronous way
// const textInput = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textInput);

// const textOutput = `This is what we know about the avocado: ${textInput}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOutput);
// console.log("File written");

// // Non-blocking, asynchronous way
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR!");

//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       console.log(data3);

//       fs.writeFile("./txt/final.txt", `${data2}/n${data3}`, "utf-8", (err) => {
//         console.log("File has been written 😀");
//       });
//     });
//   });
// });
// console.log("Will read file!");

//////////////////////////////
// SERVER
const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
// console.log(slugify("Fresh Avocados", { lower: true }));
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
  // const { query, pathname } = url.parse(req.url, true);
  const myURL = new URL(`http://127.0.0.1:8000${req.url}`);
  const { searchParams, pathname: pathName } = myURL;

  // Overview page
  if (pathName === "/" || pathName === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(templateCard, el))
      .join("");
    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);

    // Product page
  } else if (pathName === "/product") {
    // console.log(query);
    // res.end("This is the PRODUCT!");
    res.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj.find((el) => el.id == searchParams.get("id"));
    output = replaceTemplate(templateProduct, product);
    res.end(output);

    // API
  } else if (pathName === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // Not found
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-world",
    });
    res.end("<h1>Page could not be found!</h1>");
  }
  // res.end("Hello from the server!");
});

// 127.0.0.1 -> Standard Ip address for localhost
server.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
