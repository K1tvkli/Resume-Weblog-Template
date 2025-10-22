# Changelog - راه‌اندازی Supabase

## نسخه 2.1.0 - 2025-01-22

### ✨ ویژگی‌های جدید

#### 🗄️ پشتیبانی کامل از Supabase
- نصب و پیکربندی `@supabase/supabase-js`
- ایجاد کلاینت Supabase با تنظیمات بهینه
- پشتیبانی از متغیرهای محیطی با `dotenv-webpack`

#### 📦 فایل‌های جدید

1. **src/supabase.ts**
   - پیکربندی و راه‌اندازی Supabase Client
   - تایپ‌های TypeScript برای دیتابیس
   - مدیریت اتصال و خطاها

2. **src/database.service.ts**
   - سرویس کامل برای عملیات CRUD
   - متدهای آماده برای پست‌ها و نظرات
   - پشتیبانی از جستجو
   - اشتراک Real-time روی تغییرات

3. **src/supabase.examples.ts**
   - مثال‌های کاربردی و آماده
   - راهنمای استفاده از هر متد
   - تست اتصال و عملیات

4. **SUPABASE_SETUP.md**
   - راهنمای گام‌به‌گام راه‌اندازی
   - دستورات SQL برای ایجاد جداول
   - نمونه کدهای استفاده
   - نکات امنیتی

5. **supabase-schema.sql**
   - Schema کامل دیتابیس
   - جداول posts و comments
   - Row Level Security (RLS)
   - توابع کمکی SQL
   - داده‌های نمونه

6. **.env و .env.example**
   - مدیریت متغیرهای محیطی
   - کلیدهای Supabase
   - حفاظت از اطلاعات حساس

### 🔧 تغییرات

- **webpack.config.js**: افزودن `dotenv-webpack` برای لود متغیرهای محیطی
- **.gitignore**: اضافه شدن `.env` برای امنیت
- **package.json**: افزودن dependencies جدید
- **README.md**: به‌روزرسانی مستندات و اضافه شدن بخش Supabase

### 📚 مستندات

- راهنمای کامل راه‌اندازی Supabase
- مثال‌های کد برای تمام عملیات
- نکات امنیتی و best practices
- راهنمای دیپلوی در Vercel

### 🎯 API های موجود

#### DatabaseService Methods:
- `getPosts()` - دریافت تمام پست‌ها
- `getPostById(id)` - دریافت یک پست خاص
- `createPost(post)` - ایجاد پست جدید
- `updatePost(id, updates)` - به‌روزرسانی پست
- `deletePost(id)` - حذف پست
- `getCommentsByPostId(postId)` - دریافت نظرات یک پست
- `createComment(comment)` - ایجاد نظر جدید
- `searchPosts(query)` - جستجو در پست‌ها
- `subscribeToTable(tableName, callback)` - اشتراک Real-time

### 🔐 امنیت

- استفاده از Row Level Security (RLS)
- محافظت از کلیدها با `.env`
- فقط پست‌های منتشر شده قابل مشاهده
- نظرات نیاز به تایید دارند

### 📦 Dependencies جدید

```json
{
  "@supabase/supabase-js": "^2.x",
  "dotenv-webpack": "^8.x" (dev)
}
```

### 🚀 نحوه استفاده

```typescript
import DatabaseService from './database.service';

// دریافت پست‌ها
const { data, error } = await DatabaseService.getPosts();

// Real-time
const unsubscribe = DatabaseService.subscribeToTable('posts', (payload) => {
  console.log('تغییر جدید:', payload);
});
```

### 📝 نکات مهم

1. حتماً فایل `.env` را با اطلاعات پروژه Supabase خود تنظیم کنید
2. جداول دیتابیس را با استفاده از `supabase-schema.sql` ایجاد کنید
3. برای production، متغیرهای محیطی را در Vercel تنظیم کنید
4. از `anon` key استفاده کنید، نه `service_role` key

### 🐛 رفع مشکلات

- خطاهای TypeScript در `database.service.ts` رفع شد
- مشکل webpack برای `dotenv-webpack` حل شد
- سازگاری با تمام متدهای Supabase

---

**توسعه‌دهنده**: دکتر یوسف ندایی  
**تاریخ**: 22 ژانویه 2025 (2 بهمن 1403)
