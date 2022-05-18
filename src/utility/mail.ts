import { USER_MAIL,USER_PASSWORD } from "../config";
import * as nodemailer from 'nodemailer';
import * as handlebars from 'handlebars';
import smtpTransport from "nodemailer-smtp-transport";
import * as fs from 'fs';
import * as path from 'path';

const transport = nodemailer.createTransport(smtpTransport({
    service: 'gmail',
    auth: {
      user: USER_MAIL,
      pass: USER_PASSWORD,
    },
  }));

export const sendMail = async (email:string,otp:number) => {
  const filePath = path.join(__dirname, '../template/otpverification.html');
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  const htmlToSend = template({otp});
    const mailOptions:object = {
      from: USER_MAIL,
      to: email,
      subject: 'Verify your mail',
      text: `Hey , is your otp`,
      html:htmlToSend,
    }
   const result = await transport.sendMail(mailOptions, (error, info:any) => {
    if (error) {
      return 'error';
    } else {
      return info;
    }
  });
  return result;
}
