export const verificationEmailTemplate = (code) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Email Verification</title>
      </head>
      <body style="
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        font-family: Arial, Helvetica, sans-serif;
      ">
        <div style="
          max-width: 600px;
          margin: 40px auto;
          background: #ffffff;
          border-radius: 10px;
          padding: 40px;
          box-sizing: border-box;
        ">
          <h2 style="
            margin: 0 0 20px;
            text-align: center;
            color: #222222;
          ">
            Verify Your Email
          </h2>
          <p style="
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
          ">
            Hello,
          </p>
          <p style="
            color: #555555;
            font-size: 16px;
            line-height: 1.6;
          ">
            Thank you for registering. Please use the verification code below
            to verify your email address.
          </p>
          <div style="
            margin: 30px 0;
            text-align: center;
          ">
            <span style="
              display: inline-block;
              padding: 15px 30px;
              background: #f1f1f1;
              border-radius: 8px;
              color: #111111;
              font-size: 32px;
              font-weight: bold;
              letter-spacing: 8px;
            ">
              ${code}
            </span>
          </div>
          <p style="
            color: #777777;
            font-size: 14px;
            text-align: center;
          ">
            This verification code will expire in 5 minutes.
          </p>
          <p style="
            color: #777777;
            font-size: 14px;
            line-height: 1.5;
          ">
            If you did not request this verification code, you can safely
            ignore this email.
          </p>
          <hr style="
            border: none;
            border-top: 1px solid #eeeeee;
            margin: 30px 0;
          " />
          <p style="
            margin: 0;
            color: #999999;
            font-size: 12px;
            text-align: center;
          ">
            © 2026 My App. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  `;
};
