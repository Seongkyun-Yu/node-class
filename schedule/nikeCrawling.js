const schedule = require("node-schedule");
const axios = require("axios");
const cheerio = require("cheerio");
const run = () => {
  schedule.scheduleJob("*/2 * * * * *", async () => {
    console.log("10초마다 실행 테스트");
    let html = await getHtml();
    let nike = await getSmp(html);
  });
};
async function getHtml() {
  try {
    return await axios.get(
      "https://www.nike.com/kr/launch/?type=upcoming&activeDate=date-filter:AFTER"
    );
  } catch (error) {
    console.error(error);
  }
}
async function getSmp(html) {
  if (!html) {
    html = await getHtml();
  }
  let smp = {};
  const $ = cheerio.load(html.data);
  $(".item-list-wrap")
    .find(".upcomingItem")
    .each(function (index, elem) {
      let month = $(this).find(".month").text();
      let day = $(this).find(".day").text();
      let title = $(this).find(".txt-description").text();
      console.log(month, day, title);
    });
  return smp;
}
module.exports = {
  run: run,
};
