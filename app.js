/* eslint-disable class-methods-use-this */
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const WebSocket = require("ws");

const mainRouter = require("./router/mainRouter");
const userRouter = require("./router/userRouter");
const excelRouter = require("./router/excelRouter");
const imageRouter = require("./router/imageRouter");

const nikeCrawling = require("./schedule/nikeCrawling");
const { testMailer } = require("./mail/testMailer");

const db = require("./model/db");

class AppServer extends http.Server {
  constructor(config) {
    const app = express();
    super(app);
    this.conifg = config;
    this.app = app;

    this.currentConns = new Set();
    this.busy = new WeakSet();
    this.stop = false;
  }

  start() {
    this.set();
    this.middleWare();
    this.router();
    this.dbConnection();
    // this.schedule();

    this.app.use("/public", express.static(__dirname + "/public"));

    let testMail = {
      receiver: ["ysungkyun@gmail.com"],
      subject: "클래스형 노드서버가 켜짐",
      content: "<h1>서버 안전 운행중 - 이상무</h1>",
    };
    // testMailer(testMail); // 앱 비번 입력 후 주석 풀어라

    return this;
  }

  set() {
    this.app.engine("html", require("ejs").renderFile);
    this.app.set("views", __dirname + "/views");
    this.app.set("view engine", "html");
  }

  middleWare() {
    this.app.use(helmet());
    this.app.use(bodyParser());
    this.app.use(cookieParser());
    this.app.use((req, res, next) => {
      console.log("미들웨어");
      next();
    });
  }

  router() {
    this.app.use("/", mainRouter);
    this.app.use("/user", userRouter);
    this.app.use("/excel", excelRouter);
    this.app.use("/image", imageRouter);

    this.app.use((req, res, next) => {
      res.status(404);
      res.send("잘못된 요청입니다");
    });
  }

  dbConnection() {
    db.sequelize
      .authenticate()
      .then(() => {
        console.log("DB접속 완료");
        return db.sequelize.sync({ force: false });
      })
      .then(() => {
        console.log("디비 접속 완료 후 다음 할 일");
      })
      .catch((err) => {
        console.log("DB접속이 실패됐을 경우");
        console.log(err);
      });
  }

  schedule() {
    nikeCrawling.run();
  }
}

const createServer = (config = {}) => {
  const server = new AppServer();
  return server.start();
};

const connectUpbit = () => {
  const ws = new WebSocket("wss://api.upbit.com/websocket/v1");

  ws.on("open", () => {
    console.log("연결됨");

    ws.send(
      JSON.stringify([
        { ticket: "test" },
        { type: "ticker", codes: ["KRW-BTC"] },
      ])
    );
  });

  ws.on("message", (data) => {
    console.log(data.toString("utf-8"));
  });
};

exports.createServer = createServer;
exports.connectUpbit = connectUpbit;
