const express = require("express");
const router = express.Router();
const fs = require("fs");
const multiparty = require("multiparty");
const readXlsxFile = require("read-excel-file/node");

router.get("/", async (req, res) => {
  res.render("excel");
});

router.post("/upload", async (req, res, next) => {
  let form = new multiparty.Form();
  await form.parse(req, async (err, fields, files) => {
    if (err || !files || !files.file || files.length == 0) {
      res.send({ success: 400, message: "리소스를 찾을 수 없습니다" });
      return;
    }
    let query = {
      file: JSON.parse(JSON.stringify(files.file[0])) || null,
    };
    await readXlsxFile(fs.createReadStream(files.file[0].path)).then(
      async (rows) => {
        await res.send({
          success: 200,
          message: "엑셀 JSON 데이터",
        });
      }
    );
  });
});

module.exports = router;
