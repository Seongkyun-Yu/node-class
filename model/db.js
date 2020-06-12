// 시퀄라이즈 설정만 있는 변수
let Sequelize = require("sequelize");
// 시퀄라이즈를 직접 사용하게끔 해주는 변수
let sequelize;

sequelize = new Sequelize("fastcampusyu", "ysungkoon", "fastcampus", {
  host: "fastcampusyu.cpmh74dcojcg.ap-northeast-2.rds.amazonaws.com",
  dialect: "mysql",
  port: 3306,
  operatorsAliases: false,
  timezone: "+09:00", //한국 시간 셋팅
  define: {
    charset: "utf8",
    collate: "utf8_general_ci",
    timestamps: true,
  },
});

const db = {};

db.users = sequelize.import(__dirname + "/users.js");

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
