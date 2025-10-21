# وبلاگ رزومه دکتر یوسف ندایی

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Webpack](https://img.shields.io/badge/Webpack-8DD6F9?style=for-the-badge&logo=webpack&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**یک وبلاگ رزومه تک‌صفحه‌ای، مدرن و حرفه‌ای با TypeScript** 🚀

[مشاهده دمو](#) | [گزارش مشکل](https://github.com/your-repo/issues) | [درخواست ویژگی](https://github.com/your-repo/issues)

</div>

---

## ✨ ویژگی‌ها

### 🎨 طراحی مدرن
- **Glass Morphism Effect** - افکت شیشه‌ای پیشرفته با backdrop-filter
- **گرادیان‌های متحرک** - انیمیشن‌های روان و چشم‌نواز
- **تصویر پس‌زمینه ثابت** - با افکت paralax
- **طراحی تمیز و مینیمال** - تمرکز بر محتوا

### 💻 تکنولوژی پیشرفته
- **TypeScript** - Type-safe و قابل نگهداری
- **Webpack 5** - بهینه‌سازی و bundling پیشرفته
- **CSS3 مدرن** - Grid, Flexbox, Custom Properties
- **کلاس‌های OOP** - معماری تمیز و ماژولار

### 🎭 انیمیشن‌ها
- **Intersection Observer API** - انیمیشن‌های بهینه هنگام اسکرول
- **افکت Ripple** - بر روی دکمه‌ها
- **افکت 3D Tilt** - بر روی کارت‌ها با موس
- **انیمیشن‌های ورود** - Fade و Slide برای المنت‌ها

### 📱 کاملاً واکنش‌گرا (Responsive)
- موبایل، تبلت و دسکتاپ
- فونت‌های responsive با clamp()
- لی‌اوت انعطاف‌پذیر

### ♿ دسترسی‌پذیر (Accessible)
- Semantic HTML5
- ARIA labels
- Focus states واضح
- Keyboard navigation

---

## 🚀 شروع سریع

### پیش‌نیازها

```bash
node >= 14.0.0
npm >= 6.0.0
```

### نصب

```bash
# کلون کردن پروژه
git clone https://github.com/K1tvkli/Resume-Weblog-Template.git

# ورود به پوشه پروژه
cd Resume-Weblog-Template

# نصب وابستگی‌ها
npm install
```

### اجرای پروژه

```bash
# حالت Development با Hot Reload
npm run dev

# Build برای Production
npm run build

# بررسی Type های TypeScript
npm run type-check
```

پروژه در آدرس [http://localhost:3000](http://localhost:3000) اجرا خواهد شد.

---

## 📁 ساختار پروژه

```
Resume-Weblog-Template/
├── src/
│   ├── index.html          # فایل HTML اصلی
│   ├── main.ts             # نقطه ورود اصلی
│   ├── app.ts              # کلاس اصلی برنامه
│   ├── animations.ts       # مدیریت انیمیشن‌ها
│   ├── utils.ts            # توابع کمکی
│   └── styles/
│       └── main.css        # استایل‌های اصلی
├── dist/                   # فایل‌های build شده
├── webpack.config.js       # تنظیمات Webpack
├── tsconfig.json           # تنظیمات TypeScript
├── package.json
└── README.md
```

---

## 🎯 معماری کد

### کلاس‌های TypeScript

#### `App` (app.ts)
کلاس اصلی برنامه که مسئول:
- مدیریت lifecycle برنامه
- راه‌اندازی event listeners
- مدیریت تعاملات کاربر
- افکت‌های موس و اسکرول

#### `AnimationManager` (animations.ts)
مدیریت انیمیشن‌ها با:
- Intersection Observer API
- پیکربندی انیمیشن‌های سفارشی
- کنترل زمان‌بندی و easing

#### توابع کمکی (utils.ts)
- تبدیل اعداد به فارسی
- Throttle و Debounce
- اسکرول smooth
- و...

---

## 🎨 سفارشی‌سازی

### تغییر رنگ‌ها

فایل `src/styles/main.css` را باز کرده و متغیرهای CSS را تغییر دهید:

```css
:root {
  --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --secondary-gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  /* ... */
}
```

### تغییر محتوا

فایل `src/index.html` را ویرایش کنید و اطلاعات خود را جایگزین کنید.

### تغییر لینک‌های شبکه‌های اجتماعی

در فایل `src/app.ts` در متد `handleSocialClick`:

```typescript
const links: Record<string, string> = {
  telegram: 'https://t.me/your_username',
  instagram: 'https://instagram.com/your_username',
  whatsapp: 'https://wa.me/your_number',
};
```

---

## 🌐 دیپلوی

### Vercel (پیشنهادی)

```bash
# نصب Vercel CLI
npm i -g vercel

# لاگین
vercel login

# دیپلوی
npm run deploy
```

یا به سادگی:
1. پوش کردن کد به GitHub
2. رفتن به [vercel.com](https://vercel.com)
3. Import کردن repository
4. کلیک روی Deploy! ✨

### Netlify

```bash
# Build پروژه
npm run build

# آپلود پوشه dist/ به Netlify
```

---

## 🛠️ تکنولوژی‌ها و ابزارها

| تکنولوژی | نسخه | توضیح |
|---------|------|-------|
| TypeScript | ^5.3.3 | زبان اصلی برنامه‌نویسی |
| Webpack | ^5.89.0 | ابزار bundling و بهینه‌سازی |
| CSS3 | - | استایل‌دهی پیشرفته |
| HTML5 | - | ساختار semantic |

### Dev Dependencies

```json
{
  "typescript": "^5.3.3",
  "webpack": "^5.89.0",
  "webpack-cli": "^5.1.4",
  "webpack-dev-server": "^4.15.1",
  "ts-loader": "^9.5.1",
  "html-webpack-plugin": "^5.5.4",
  "css-loader": "^6.8.1",
  "style-loader": "^3.3.3",
  "copy-webpack-plugin": "^11.0.0"
}
```

---

## 📊 بهینه‌سازی‌ها

- ✅ **Tree Shaking** - حذف کدهای استفاده نشده
- ✅ **Code Splitting** - بارگذاری تدریجی
- ✅ **Minification** - فشرده‌سازی کد
- ✅ **Source Maps** - دیباگ آسان‌تر
- ✅ **Caching** - با contenthash
- ✅ **Lazy Loading** - برای تصاویر
- ✅ **CSS Optimization** - با backdrop-filter
- ✅ **Animation Performance** - با will-change

---

## 🤝 مشارکت

مشارکت‌های شما همیشه خوش‌آمد است! 

1. Fork کنید
2. Branch جدید بسازید (`git checkout -b feature/AmazingFeature`)
3. تغییرات را Commit کنید (`git commit -m 'Add some AmazingFeature'`)
4. Push کنید (`git push origin feature/AmazingFeature`)
5. Pull Request باز کنید

---

## 📝 لایسنس

این پروژه تحت لایسنس MIT منتشر شده است - برای جزئیات بیشتر فایل [LICENSE](LICENSE) را ببینید.

---

## 👨‍💻 توسعه‌دهنده

**دکتر یوسف ندایی**

- 🎓 دانشجوی پزشکی دانشگاه علوم پزشکی شهید بهشتی
- 🏆 رتبه ۱۱۵ کنکور سراسری ۱۴۰۱
- 📚 مدرس و مولف زیست شناسی کنکور

---

## 🙏 تشکر

- [Vazirmatn Font](https://github.com/rastikerdar/vazirmatn) - فونت فارسی زیبا
- [TypeScript](https://www.typescriptlang.org/) - زبان قدرتمند
- [Webpack](https://webpack.js.org/) - ابزار عالی bundling

---

<div align="center">

**ساخته شده با ❤️ و TypeScript**

اگر این پروژه برایتان مفید بود، یک ⭐ بدهید!

[⬆ برگشت به بالا](#وبلاگ-رزومه-دکتر-یوسف-ندایی)

</div>
