const fs = require("fs");

const objectsArray = [];

const { Sheet5: allObjects } = require("./localization (5).json");

console.log(allObjects);

for (let i = 0; i < allObjects.length; i += 100) {
  let end = i + 100;
  if (end > allObjects.length) {
    end = allObjects.length;
  }
  const quizDetails = allObjects.slice(i, end).map((obj, index) => {
    obj.qNo = index + 1;
    return obj;
  });

  objectsArray.push({
    quizDetails,
    quizTitle: "PYQ " + (i / 100 + 1),
    createdAt: new Date().toJSON(),
    maxMarks: 100,
  });
}

fs.writeFileSync("output.json", JSON.stringify(objectsArray, null, 2));

console.log(objectsArray);
