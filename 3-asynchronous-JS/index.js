const fs = require("fs");
const superagent = require("superagent");

const readFilePromise = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject("Unable to find file");
      resolve(data);
    });
  });
};

const writeFilePromise = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject("Unable to find file");
      resolve("Successfully resovled");
    });
  });
};

const getDogPic = async () => {
  try {
    const data = await readFilePromise(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res = await superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    console.log(res.body.message);

    await writeFilePromise("dog-img.text", res.body.message);
    console.log("Random dog image saved to file");
  } catch (err) {
    console.log(err);

    throw err; // Will mark entire promise as rejected
  }
  return "2: READY";
};

(async () => {
  try {
    console.log("1: Will get dog pics");
    const x = await getDogPic();
    console.log(x);
    console.log("3: Done getting dog pics");
  } catch (err) {
    console.log("ERROR");
  }
})();

// console.log("1: Will get dog pics");
// getDogPic()
//   .then((x) => {
//     // .then to make sure console log stataments run in order
//     console.log(x);
//     console.log("3: Done getting dog pics");
//   })
//   .catch((err) => {
//     console.log("ERROR");
//   });
