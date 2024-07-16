const app = require("./app");
const path = require("path");
const connectDatabase = require("./config/database");
const cors = require("cors");
const express = require("express");
const imgur = require("imgur");
const fs = require("fs");
const fileUpload = require("express-fileupload");
const { sendMail } = require("./controllers/SendMail");

const bodyparser = require("body-parser");

app.use(fileUpload());
app.use(
  bodyparser.json({
    limit: "20mb",
  })
);
app.use(cors({ orgin: ["http://localhost:3000"], credentials: true }));
app.use(express.static("../frontend/public"));
app.use(express.static("../frontend/public/images"));

connectDatabase();

const server = app.listen(process.env.PORT, () => {
  console.log(
    ` My server listening to the port: ${process.env.PORT} in ${process.env.NODE_ENV}  `
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to unhandled rejection error");
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server due to uncaught exception error");
  server.close(() => {
    process.exit(1);
  });
});

app.use("/uploads", express.static("uploads"));
// console.log(a);  part 2 la last la paattha theriyum

const uploadDir = __dirname + "/uploads";
app.use("uploads", express.static("uploads"));
// app.post("/upload", (req, res) => {
//   if (!req.files) {
//     return res.status(400).send("No files were uploaded.");
//   }
//   let sampleFile = req.files.sampleFile;
//   let uploadPath = __dirname + "/uploads/" + sampleFile.name;
//   fs.writeFileSync(uploadPath, sampleFile.data);
//   imgur.uploadFile(uploadPath).then((urlObject) => {
//     fs.unlinkSync(uploadPath);
//     return res.status(200).json({ link: urlObject.data.link });
//   });
// });
app.post("/upload", async (req, res) => {
  try {
    if (!req.files) {
      return res.status(400).send("No files were uploaded.");
    }
    let sampleFile = req.files.sampleFile;
    let uploadPath = __dirname + "/uploads/" + sampleFile.name;
    // Write file to the upload path
    fs.writeFileSync(uploadPath, sampleFile.data);
    // Upload file to Imgur
    const urlObject = await imgur.uploadFile(uploadPath);
    // Remove the uploaded file after uploading to Imgur
    fs.unlinkSync(uploadPath);
    // Send the Imgur URL in the response
    return res.status(200).json({ link: urlObject.data.link });
  } catch (error) {
    console.error("Error occurred during file upload:", error);
    return res.status(500).send("Internal server error occurred.");
  }
});

app.post("/mail", (req, res) => {
  let bodyData = req.body;
  let content = `
  <div>
  <div>
  <div>
    <div>Brand: ${bodyData.Sellbrand}</div>
    <div>Model: ${bodyData.Sellmodel}</div>
    <div>Year: ${bodyData.Sellyear}</div>
    <div>Sellkm:${bodyData.Sellkm}</div>
  </div>

  <div>
    <h2>RC Book PhotoCopies</h2>
    <div>
      RC Book Photo 1
      <div>
        <img style="width: 500px; height: 500px"  src="${bodyData.SellImage1}" alt="${bodyData.SellImage1}" />
      </div>
    </div>
    <div>
      RC Book Photo 2
      <div>
        <img style="width: 500px; height: 500px" src="${bodyData.SellImage2}" alt="${bodyData.SellImage2}" />
      </div>
    </div>
    <div>
      RC Book Photo 3
      <div>
        <img style="width: 500px; height: 500px" src="${bodyData.SellImage3}" alt="${bodyData.SellImage3}" />
      </div>
    </div>
  </div>

  <div>
    <h2>Insurance Book PhotoCopies</h2>
    <div>
      Insurance Book Photo 1
      <div>
        <img style="width: 500px; height: 500px" src="${bodyData.SellImage4}" alt="${bodyData.SellImage4}" />
      </div>
    </div>
    <div>
      Insurance Book Photo 2
      <div>
        <img style="width: 500px; height: 500px" src="${bodyData.SellImage5}" alt="${bodyData.SellImage5}" />
      </div>
    </div>
    <div>
      Insurance Book Photo 3
      <div>
        <img  style="width: 500px; height: 500px"src="${bodyData.SellImage6}" alt="${bodyData.SellImage6}" />
      </div>
    </div>
  </div>

  <div>
    <div>
      <h2>Bike Photo with Owner</h2>
      <div>
        Bike Photo with Owner
        <div>
          <img style="width: 500px; height: 500px" src="${bodyData.SellImage7}" alt="${bodyData.SellImage7}" />
        </div>
      </div>
      <div>
        Bike Photo with Owner
        <div>
          <img style="width: 500px; height: 500px" src="${bodyData.SellImage8}" alt="${bodyData.SellImage8}" />
        </div>
      </div>
    </div>
  </div>

  <div>
    <h2>Bike Images</h2>
    <div>
      Bike Images 1
      <div>
        <img  style="width: 500px; height: 500px"src="${bodyData.SellImage9}" alt="${bodyData.SellImage9}" />
      </div>
    </div>
    <div>
      Bike Images 2
      <div>
        <img style="width: 500px; height: 500px" src="${bodyData.SellImage10}" alt="${bodyData.SellImage10}" />
      </div>
    </div>
  </div>

  <div>
    <div>Owner or Seller:${bodyData.OwnerORSeller}</div>
    <div>SellName: ${bodyData.SellName}</div>
    <div>Email: ${bodyData.Email}</div>
    <div>Mobile: ${bodyData.Mobile}</div>
    <div>Location: ${bodyData.Location}</div>
  </div>
</div>

  </div>
  `;

  sendMail(process.env.nodeMailer_User, "Sell Bike Request", content);
  res.status(200).send("Success");
});
