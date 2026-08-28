const nodemailer = require("nodemailer");

let transporter = null;
let isSimulatedMode = false;

function isPlaceholder(value) {
    if (!value) return true;
    return value.includes("your_") || value.includes("your-") || value.includes("example.com");
}

function getTransporter() {
    if (transporter) return transporter;

    const host = process.env.SMTP_HOST?.trim();
    const port = process.env.SMTP_PORT?.trim();
    const user = process.env.SMTP_USER?.trim();
    const pass = process.env.SMTP_PASS?.trim().replace(/\s/g, "");

    // If placeholder credentials, treat as not configured -> use simulated/ethereal mode
    if (!host || !user || !pass || isPlaceholder(host) || isPlaceholder(user) || isPlaceholder(pass)) {
        console.log("⚠️  SMTP not configured (placeholder detected). Using simulated email mode. OTP will be logged to console and shown in dev response.");
        isSimulatedMode = true;
        return null;
    }

    transporter = nodemailer.createTransport({
        host: host,
        port: Number(port) || 587,
        secure: Number(port) === 465, // true for 465, false for 587
        auth: { user, pass }
    });

    return transporter;
}

async function sendOtpEmail(toEmail, otp, userName) {
    const from = (process.env.FROM_EMAIL || process.env.SMTP_USER || "noreply@skillbridgeai.com").trim();

    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #2563eb; margin: 0;">SkillBridgeAI</h2>
        <p style="color: #64748b; font-size: 13px; margin: 4px 0 0;">AI Career Intelligence Platform</p>
      </div>
      <div style="background: white; border-radius: 12px; padding: 28px; border: 1px solid #eef1f6;">
        <h3 style="color: #0f172a; margin: 0 0 12px;">Password Reset Code</h3>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">Hi ${userName || "there"},</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">You requested to reset your password. Use this OTP to continue:</p>
        <div style="text-align: center; margin: 24px 0;">
          <div style="display: inline-block; background: linear-gradient(135deg, #2563eb, #06b6d4); color: white; font-size: 32px; font-weight: 800; letter-spacing: 0.3em; padding: 16px 32px; border-radius: 12px;">${otp}</div>
        </div>
        <p style="color: #64748b; font-size: 13px; text-align: center;">Valid for <strong>10 minutes</strong>. Do not share this code.</p>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 20px;">If you didn't request this, ignore this email. Your password stays unchanged.</p>
      </div>
      <p style="color: #94a3b8; font-size: 11px; text-align: center; margin-top: 16px;">© 2026 SkillBridgeAI • This is an automated email, please do not reply.</p>
    </div>
    `;

    const text = `SkillBridgeAI - Password Reset\n\nHi ${userName || "there"},\nYour OTP is: ${otp}\nValid for 10 minutes. Do not share it.\n\nIf you didn't request this, ignore this email.`;

    const t = getTransporter();

    // If no real SMTP configured, try FREE real delivery via FormSubmit (works for ANY email, no App Password needed)
    if (!t || isSimulatedMode) {
        console.log(`\n📧 No real SMTP configured. Trying free delivery to ${toEmail} via FormSubmit...\n`);
        try {
            // FormSubmit.co delivers real email to ANY address without SMTP setup
            const formRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(toEmail)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({
                    name: "SkillBridgeAI",
                    email: "noreply@skillbridgeai.com",
                    subject: `Your SkillBridgeAI OTP is ${otp}`,
                    message: `Hi ${userName || "there"},\n\nYour SkillBridgeAI password reset OTP is: ${otp}\nValid for 10 minutes. Do not share it.\n\nIf you didn't request this, ignore this email.\n\n© SkillBridgeAI`,
                    _template: "table",
                    _captcha: "false"
                })
            });
            const formData = await formRes.json().catch(() => ({}));
            if (formRes.ok) {
                console.log(`✅ Real email sent via FormSubmit to ${toEmail} | OTP: ${otp}`);
                return { simulated: false, messageId: "formsubmit-" + Date.now() };
            }
            console.log(`FormSubmit response: ${JSON.stringify(formData)}`);
        } catch (e) {
            console.log(`FormSubmit failed: ${e.message}`);
        }

        console.log(`📧 Fallback [SIMULATED EMAIL] To: ${toEmail} | OTP: ${otp} | Valid 10 min`);
        // Also create Ethereal preview for debugging
        try {
            const testAccount = await nodemailer.createTestAccount();
            const testTransporter = nodemailer.createTransport({
                host: testAccount.smtp.host,
                port: testAccount.smtp.port,
                secure: testAccount.smtp.secure,
                auth: { user: testAccount.user, pass: testAccount.pass }
            });
            const info = await testTransporter.sendMail({
                from: `"SkillBridgeAI" <${testAccount.user}>`,
                to: toEmail,
                subject: `Your SkillBridgeAI OTP is ${otp}`,
                text,
                html
            });
            const previewUrl = nodemailer.getTestMessageUrl(info);
            console.log(`📬 Ethereal preview URL: ${previewUrl}`);
            return { simulated: true, previewUrl, otp };
        } catch (e) {
            return { simulated: true, otp };
        }
    }

    try {
        const info = await t.sendMail({
            from: `"SkillBridgeAI" <${from}>`,
            to: toEmail,
            subject: `Your SkillBridgeAI OTP is ${otp}`,
            text,
            html
        });
        console.log(`✅ Real email sent to ${toEmail} | MessageId: ${info.messageId}`);
        return { simulated: false, messageId: info.messageId };
    } catch (err) {
        console.error("❌ Email send failed:", err.message);
        // Don't block the flow - fallback to simulated so user can still test
        console.log(`📧 Fallback [SIMULATED EMAIL] To: ${toEmail} | OTP: ${otp}`);
        // Check if it's a 535 BadCredentials - give helpful message but don't throw
        if (err.message.includes("535") || err.message.includes("Username and Password not accepted") || err.message.includes("Invalid login")) {
            throw new Error(`SMTP 535 Error: Gmail rejected your App Password. Create a fresh App Password at https://myaccount.google.com/apppasswords (requires 2-Step Verification ON). Current error: ${err.message}`);
        }
        throw new Error(`Failed to send email: ${err.message}. Check SMTP settings in .env`);
    }
}

module.exports = { sendOtpEmail, getTransporter };
