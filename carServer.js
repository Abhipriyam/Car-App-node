let express = require("express");
let app = express();
var port = process.env.PORT || 2410;
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH,DELETE,HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-with, Content-Type,Accept"
  );
  next();
});
// const port = 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
let { carsData } = require("./carsData.js");
let { carsData2 } = require("./carsData.js");

app.get("/cars", function (req, res) {
  console.log("/cars", req.query);
  let modelStr = req.query.model;
  let maxprice = +req.query.maxprice;
  let minprice = +req.query.minprice;
  let fuel = req.query.fuel;
  let type = req.query.type;
  let sort = req.query.sort;

  let arr1 = carsData;

  if (modelStr) {
    let modelArr = modelStr.split(",");
    arr1 = arr1.filter((st) => modelArr.find((c1) => c1 === st.model));
  }
  if (maxprice) {
    arr1 = arr1.filter((pr) => pr.price <= maxprice);
  }
  if (minprice) {
    arr1 = arr1.filter((pa) => pa.price >= minprice);
  }
  if (fuel) {
    arr1 = arr1.filter((car) =>
      carsData2.find(
        (masterCar) => masterCar.model === car.model && masterCar.fuel === fuel
      )
    );
  }
  if (type) {
    arr1 = arr1.filter((car) =>
      carsData2.find(
        (masterCar) => masterCar.model === car.model && masterCar.type === type
      )
    );
  }
  console.log(arr1);
  if (sort === "price") arr1.sort((st1, st2) => st1.price - st2.price);
  if (sort === "kms") arr1.sort((st1, st2) => st1.kms - st2.kms);
  if (sort === "year") arr1.sort((st1, st2) => st1.year - st2.year);
  res.send(arr1);
});

app.get("/cars/:id", function (req, res) {
  let id = req.params.id;
  console.log("Id1", id);
  let car = carsData.find((st) => st.id === id);
  console.log("Id2", car);
  if (car) res.send(car);
  else res.status(404).send("No Car found");
});
app.get("/cars/model/:name", function (req, res) {
  let name = req.params.name;
  console.log("mod1", name);
  const arr1 = carsData.filter((st1) => st1.model === name);
  console.log("mod2", arr1);
  res.send(arr1);
});
app.post("/cars", function (req, res) {
  let body = req.body;
  console.log(body);

  let maxid = carsData.reduce(
    (acc, curr) => (curr.id >= acc ? curr.id : acc),
    0
  );
  let newid = maxid + 1;
  let newCar = { id: newid, ...body };
  carsData.push(newCar);
  console.log("new car", newCar);
  res.send(newCar);
});
app.put("/cars/:id", function (req, res) {
  let id = req.params.id;
  let body = req.body;
  let index = carsData.findIndex((st) => st.id === id);
  let updatedCar = { id: id, ...body };
  carsData[index] = updatedCar;
  res.send(updatedCar);
});
app.delete("/cars/:id", function (req, res) {
  let id = req.params.id;
  let index = carsData.findIndex((st) => st.id === id);
  if (index >= 0) {
    let deleteCar = carsData.splice(index, 1);
    res.send(deleteCar);
  } else res.status(404).send("NO Customer Found");
});
app.get("/carMaster", function (req, res) {
  let arr2 = carsData2;

  res.send(arr2);
});
