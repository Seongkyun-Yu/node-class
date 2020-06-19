const express = require("express");
const router = express.Router();
const fs = require("fs");
const multiparty = require("multiparty");
const readXlsxFile = require("read-excel-file/node");
const FileUpload = require("../lib/aws/fileUpload.js");
/* GET home page. */
router.get("/", async (req, res, next) => {
  res.render("image");
});
router.post("/upload", async (req, res, next) => {
  let form = new multiparty.Form();
  await form.parse(req, async (err, fields, files) => {
    console.log(files);
    if (err || !files || !files.file || files.length == 0) {
      res.send({ success: 400, message: "리소스를 찾을 수 없습니다" });
      return;
    }
    let query = {
      file: files.file[0] || null,
    };
    await FileUpload.ufile.upload(query, (err, url) => {
      console.log(err);
      console.log(url);
      res.send({
        success: 200,
        message: "파일 업로드를 성공했습니다",
        url: url,
      });
    });
  });
});
module.exports = router;
