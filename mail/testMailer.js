const nodemailer = require("nodemailer");
exports.testMailer = async function (data) {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "devseongkyun@gmail.com",
      pass: "", // 메일용 앱 비번 입력
    },
  });
  let emailList = [];
  for (let i = 0; i < data.receiver.length; i++) {
    emailList.push(data.receiver[i]);
  }
  console.log(emailList);
  const mailOptions = {
    from: "devseongkyun@gmail.com", // sender address
    to: emailList, // list of receivers
    subject: data.subject, // Subject line
    html: data.content,
  };
  await transporter.sendMail(mailOptions, function (error, info) {
    console.log(info);
    if (error) {
      console.log(error);
      return error;
    }
    return info;
  });
};
