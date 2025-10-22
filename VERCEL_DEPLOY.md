# 🚀 راهنمای Deploy به Vercel

## ✅ مشکلات برطرف شد

### مشکل 1: خطای 404
**علت:** فایل `vercel.json` به `index.html` در روت اشاره می‌کرد، در حالی که فایل در `dist/` است.

**راه‌حل:** ✅ `vercel.json` به‌روزرسانی شد:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "installCommand": "npm install"
}
```

### مشکل 2: هشدار `builds`
**علت:** استفاده از `builds` قدیمی در `vercel.json`

**راه‌حل:** ✅ حذف شد و به تنظیمات مدرن تغییر کرد

---

## 📋 دستورات Deploy

### Deploy اتوماتیک (توصیه می‌شود)
```bash
# Build + Deploy به Production
npm run deploy
```

### Deploy دستی
```bash
# 1. Build بگیرید
npm run build

# 2. Deploy کنید
npx vercel --prod
```

---

## 🔍 بررسی وضعیت

### قبل از Deploy:
```bash
# مطمئن شوید build موفق است
npm run build

# بررسی فایل‌های dist
ls -la dist/

# باید ببینید:
# - index.html ✅
# - bundle.[hash].js ✅
# - fonts/ ✅
# - images/ ✅
```

### بعد از Deploy:
1. صبر کنید تا build در Vercel تمام شود (معمولاً 30-60 ثانیه)
2. لینک production را باز کنید
3. باید صفحه اصلی سایت را ببینید ✅

---

## 🔧 تنظیمات Vercel

### در داشبورد Vercel:

#### 1. متغیرهای محیطی (Environment Variables)
Settings > Environment Variables > Add:

```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

**نکته:** برای هر سه محیط تنظیم کنید:
- ✅ Production
- ✅ Preview
- ✅ Development

#### 2. Build & Development Settings
این تنظیمات اکنون از `vercel.json` خوانده می‌شوند:

- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

---

## 🌐 دامنه‌های Deploy

بعد از deploy موفق، سه لینک دریافت می‌کنید:

1. **Production URL** (اصلی):
   ```
   https://yousefnedaei.vercel.app
   ```

2. **Preview URL** (موقت - هر deploy):
   ```
   https://yousefnedaei-[hash].vercel.app
   ```

3. **Inspection URL** (جزئیات deploy):
   ```
   https://vercel.com/[org]/[project]/[deployment-id]
   ```

---

## ❗ رفع مشکلات متداول

### مشکل: صفحه خالی یا 404
**راه‌حل:**
1. بررسی کنید `dist/index.html` موجود است
2. مطمئن شوید `vercel.json` صحیح است
3. Cache Vercel را پاک کنید:
   ```bash
   npx vercel --force
   ```

### مشکل: متغیرهای محیطی کار نمی‌کنند
**راه‌حل:**
1. در داشبورد Vercel تنظیم کنید (نه `.env`)
2. Redeploy کنید
3. بررسی کنید همه محیط‌ها (Production/Preview/Development) را تنظیم کرده‌اید

### مشکل: تصاویر نمایش داده نمی‌شوند
**راه‌حل:**
1. مطمئن شوید تصاویر در `public/images/` هستند
2. در `webpack.config.js` بررسی کنید `CopyWebpackPlugin` درست کار می‌کند
3. Build محلی بگیرید و `dist/images/` را چک کنید

### مشکل: Supabase کار نمی‌کند
**راه‌حل:**
1. Environment Variables را در Vercel تنظیم کنید
2. کلیدها را از داشبورد Supabase کپی کنید (نه `.env`)
3. Redeploy کنید

---

## 📊 مانیتورینگ

### لاگ‌های Build
در داشبورد Vercel:
1. به Deployments بروید
2. آخرین deployment را انتخاب کنید
3. تب "Building" را ببینید

### لاگ‌های Runtime
در Console مرورگر (F12):
- باید ببینید: "Resume Weblog loaded successfully!"
- اگر Supabase فعال است: "Supabase Client initialized successfully!"

---

## 🎯 Checklist قبل از Deploy

- [ ] `npm run build` موفق است
- [ ] `dist/index.html` موجود است
- [ ] Environment Variables در Vercel تنظیم شده
- [ ] `.env` در `.gitignore` است (به Git push نشود)
- [ ] `vercel.json` صحیح است
- [ ] Git changes commit شده‌اند

---

## 💡 نکات بهینه‌سازی

### 1. تصاویر
تصاویر شما بزرگ هستند:
- `BackgroundEraser_20251021_210103694.png` - 1.18 MB
- `shahid-beheshti.png` - 1 MB
- `kheilisabz.png` - 833 KB

**توصیه:**
```bash
# فشرده‌سازی تصاویر
python3 resize_favicon.py  # یا ابزار دیگر
```

### 2. Caching
Vercel به صورت خودکار static assets را cache می‌کند ✅

### 3. CDN
همه فایل‌های شما از طریق Vercel Edge Network سرو می‌شوند ✅

---

## 🔗 لینک‌های مفید

- [داشبورد Vercel](https://vercel.com/dashboard)
- [مستندات Vercel](https://vercel.com/docs)
- [Vercel CLI](https://vercel.com/docs/cli)
- [داشبورد Supabase](https://supabase.com/dashboard)

---

## ✅ موفق باشید!

حالا سایت شما روی Vercel در دسترس است! 🎉

اگر مشکلی داشتید:
1. لاگ‌های Vercel را چک کنید
2. Console مرورگر را ببینید (F12)
3. `npm run build` را محلی تست کنید
