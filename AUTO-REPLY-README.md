# راهنمای استفاده از قالب ایمیل پاسخ خودکار

## 📧 درباره این فایل

فایل `auto-reply-email-template.html` یک قالب ایمیل HTML زیبا و حرفه‌ای است که برای پاسخ خودکار به پیام‌های فرم تماس طراحی شده است.

## ✨ ویژگی‌ها

- **طراحی مدرن و جذاب** با گرادیانت بنفش/آبی
- **پشتیبانی کامل از راست‌چین (RTL)** برای متن فارسی
- **طراحی واکنش‌گرا (Responsive)** - در موبایل و دسکتاپ به خوبی نمایش داده می‌شود
- **لحن دوستانه و صمیمی** با استفاده از ایموجی‌ها
- **لینک‌های شبکه‌های اجتماعی** (تلگرام، اینستاگرام، واتساپ)
- **سازگار با تمام سرویس‌های ایمیل** (Gmail, Outlook, Yahoo و...)

## 🎨 پیش‌نمایش

برای مشاهده پیش‌نمایش، فایل HTML را در مرورگر باز کنید:

```bash
# با استفاده از Python
python3 -m http.server 8000
# سپس به http://localhost:8000/auto-reply-email-template.html بروید

# یا مستقیماً فایل را در مرورگر باز کنید
```

## 🔧 نحوه استفاده

### روش ۱: استفاده در سرویس‌های ایمیل مارکتینگ

1. محتوای فایل HTML را کپی کنید
2. در پنل مدیریت سرویس ایمیل (مثل Mailchimp، SendGrid، یا...)
3. قالب جدیدی ایجاد کنید و کد HTML را وارد کنید
4. تنظیمات پاسخ خودکار را فعال کنید

### روش ۲: استفاده با Node.js و Nodemailer

```javascript
const nodemailer = require('nodemailer');
const fs = require('fs');

// خواندن قالب HTML
const emailTemplate = fs.readFileSync('./auto-reply-email-template.html', 'utf8');

// تنظیمات ایمیل
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-password'
  }
});

// ارسال ایمیل
let mailOptions = {
  from: 'your-email@gmail.com',
  to: 'recipient@example.com',
  subject: 'پیام شما دریافت شد - دکتر یوسف ندایی',
  html: emailTemplate
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
```

### روش ۳: استفاده با Supabase Edge Functions

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const emailTemplate = `<!-- محتوای HTML را اینجا بگذارید -->`;

serve(async (req) => {
  const { email, name } = await req.json()
  
  // ارسال ایمیل با استفاده از سرویس SMTP
  // یا استفاده از API سرویس‌های ایمیل مثل SendGrid
  
  return new Response(
    JSON.stringify({ message: "Email sent successfully" }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

## 🎯 شخصی‌سازی

### تغییر رنگ‌ها

در بخش `<style>` فایل HTML، رنگ‌های اصلی را می‌توانید تغییر دهید:

```css
/* رنگ اصلی گرادیانت */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* برای تغییر به رنگ دیگر، مثلاً سبز: */
background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
```

### تغییر متن

تمام متن‌های فارسی در بخش `<body>` قابل ویرایش هستند. می‌توانید:
- پیام خوش‌آمدگویی را تغییر دهید
- زمان پاسخ‌دهی را تنظیم کنید
- لینک‌های شبکه‌های اجتماعی را به‌روزرسانی کنید

### افزودن متغیرهای دینامیک

می‌توانید جایگزین‌هایی برای اطلاعات کاربر اضافه کنید:

```html
<!-- قبل -->
<div class="greeting">سلام دوست عزیز!</div>

<!-- بعد -->
<div class="greeting">سلام {{name}} عزیز!</div>
```

سپس در کد خود این متغیرها را جایگزین کنید:

```javascript
let personalizedEmail = emailTemplate.replace('{{name}}', userFullName);
```

## 📱 لینک‌های شبکه‌های اجتماعی

لینک‌های فعلی در قالب:
- **تلگرام**: https://telegram.me/yousefnedaei_JZ
- **اینستاگرام**: https://instagram.com/yousefnedaei2003
- **واتساپ**: https://wa.me/qr/4PIKYR4TQQE5I1

برای تغییر، در فایل HTML بخش Social Links را پیدا کنید و لینک‌ها را به‌روزرسانی کنید.

## 🧪 تست

برای تست کردن قالب:

1. **تست در مرورگرها مختلف**: Chrome، Firefox، Safari، Edge
2. **تست در دستگاه‌های موبایل**: اندروید و iOS
3. **تست در سرویس‌های ایمیل**: Gmail، Outlook، Yahoo
4. **استفاده از ابزارهای تست**: 
   - [Litmus](https://www.litmus.com/)
   - [Email on Acid](https://www.emailonacid.com/)

## 💡 نکات مهم

1. **تصاویر**: در حال حاضر از ایموجی‌ها استفاده شده که همه‌جا پشتیبانی می‌شوند
2. **فونت**: از فونت‌های سیستمی استفاده شده که در همه دستگاه‌ها موجود است
3. **سازگاری**: قالب با تمام کلاینت‌های ایمیل معروف تست شده
4. **حجم**: حجم فایل کم است و سریع لود می‌شود

## 🔒 امنیت

- هیچ اسکریپت یا کد خارجی در قالب استفاده نشده
- تمام لینک‌ها از HTTPS استفاده می‌کنند
- اطلاعات حساس در فایل وجود ندارد

## 📞 پشتیبانی

در صورت نیاز به تغییرات یا سوال:
- **طراح قالب**: امیرکیوان توکلی
- **تلگرام**: [@K1tvk](https://telegram.me/K1tvk)
- **ایمیل**: AK1.Tavakkoli81@gmail.com

## 📄 مجوز

این قالب تحت مجوز MIT منتشر شده و می‌توانید آزادانه از آن استفاده کنید.

---

**ساخته شده با ❤️ برای دکتر یوسف ندایی**
