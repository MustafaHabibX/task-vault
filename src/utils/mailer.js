import nodeMailer from "nodemailer";

const testAccount = await nodeMailer.createTestAccount();

const transporter = nodeMailer.createTransport({
  host: testAccount.smtp.host,
  port: testAccount.smtp.port,
  secure: testAccount.smtp.secure,
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
});

export default async function sendMail(toEmailAddress, subject, bodyText) {
  try {
    const mailResult = await transporter.sendMail({
      from: '"Task Vault" <no-reply@taskvault.com>',
      to: toEmailAddress,
      subject: subject,
      text: bodyText,
    });

    const mailURL = `Preview URL: ${nodeMailer.getTestMessageUrl(mailResult)}`;

    return {
      mailSentStatus: "Email sent successfully.",
      mailURL: mailURL,
      mailResult: mailResult,
    };
  } catch (err) {
    return {
      mailSentStatus: ` Error sending email: \n, ${err}`,
      mailURL: "URL unavailable",
      mailResult: "Error!",
    };
  }
}
