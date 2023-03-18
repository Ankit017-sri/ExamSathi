const fs = require("fs");

const objectsArray = [];

const { Sheet3: allObjects } = require("./localization.json");

console.log(allObjects);

for (let i = 0; i < allObjects.length; i += 15) {
  let end = i + 15;
  if (end > allObjects.length) {
    end = allObjects.length;
  }
  const quizDetails = allObjects.slice(i, end).map((obj, index) => {
    obj.qNo = index + 1;
    return obj;
  });
  objectsArray.push({
    quizDetails,
    quizTitle: "चालू घडामोडी टेस्ट! " + (i / 15 + 1),
    createdAt: new Date().toJSON(),
    maxMarks: 15,
  });
}

fs.writeFileSync("output.json", JSON.stringify(objectsArray, null, 2));

console.log(objectsArray);
