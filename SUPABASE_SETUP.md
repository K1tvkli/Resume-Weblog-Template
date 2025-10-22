# راهنمای راه‌اندازی Supabase

این راهنما به شما کمک می‌کند تا Supabase را در پروژه خود راه‌اندازی کنید.

## 📋 فهرست

1. [ایجاد پروژه Supabase](#1-ایجاد-پروژه-supabase)
2. [دریافت اطلاعات اتصال](#2-دریافت-اطلاعات-اتصال)
3. [پیکربندی پروژه](#3-پیکربندی-پروژه)
4. [ایجاد جداول دیتابیس](#4-ایجاد-جداول-دیتابیس)
5. [استفاده از Supabase](#5-استفاده-از-supabase)

---

## 1. ایجاد پروژه Supabase

1. به [supabase.com](https://supabase.com) بروید
2. روی **"Start your project"** کلیک کنید
3. با GitHub یا ایمیل خود ثبت‌نام کنید
4. روی **"New Project"** کلیک کنید
5. یک Organization انتخاب یا ایجاد کنید
6. اطلاعات پروژه را وارد کنید:
   - **Name**: نام پروژه (مثلاً: `resume-weblog`)
   - **Database Password**: یک رمز عبور قوی (حتماً ذخیره کنید!)
   - **Region**: نزدیک‌ترین منطقه به خود را انتخاب کنید
   - **Pricing Plan**: Free Plan برای شروع کافی است

---

## 2. دریافت اطلاعات اتصال

بعد از ایجاد پروژه:

1. به **Settings** بروید (آیکون چرخ‌دنده در سایدبار)
2. روی **API** کلیک کنید
3. اطلاعات زیر را کپی کنید:

```
Project URL: https://xxxxxxxxxx.supabase.co
anon public key: eyJhbGc...
```

---

## 3. پیکربندی پروژه

### 3.1. تنظیم فایل .env

فایل `.env` را در روت پروژه باز کنید و اطلاعات اتصال را وارد کنید:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
```

**نکته مهم**: فایل `.env` در `.gitignore` قرار دارد و به Git push نمی‌شود. این برای امنیت کلیدها است.

---

## 4. ایجاد جداول دیتابیس

### 4.1. ایجاد جدول Posts

1. در داشبورد Supabase، به **SQL Editor** بروید
2. کوئری زیر را اجرا کنید:

```sql
-- جدول پست‌های وبلاگ
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  published BOOLEAN DEFAULT false
);

-- فعال‌سازی Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- سیاست خواندن: همه می‌توانند پست‌های منتشر شده را ببینند
CREATE POLICY "پست‌های منتشر شده عمومی هستند"
  ON posts FOR SELECT
  USING (published = true);

-- ایندکس برای بهبود کارایی
CREATE INDEX posts_published_idx ON posts(published);
CREATE INDEX posts_created_at_idx ON posts(created_at DESC);
```

### 4.2. ایجاد جدول Comments

```sql
-- جدول نظرات
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  approved BOOLEAN DEFAULT false
);

-- فعال‌سازی Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- سیاست خواندن: همه می‌توانند نظرات تایید شده را ببینند
CREATE POLICY "نظرات تایید شده عمومی هستند"
  ON comments FOR SELECT
  USING (approved = true);

-- سیاست نوشتن: همه می‌توانند نظر بگذارند (اما باید تایید شود)
CREATE POLICY "همه می‌توانند نظر بگذارند"
  ON comments FOR INSERT
  WITH CHECK (true);

-- ایندکس‌ها
CREATE INDEX comments_post_id_idx ON comments(post_id);
CREATE INDEX comments_approved_idx ON comments(approved);
```

### 4.3. افزودن داده‌های نمونه (اختیاری)

```sql
-- پست نمونه
INSERT INTO posts (title, content, author, published) VALUES
  ('خوش آمدید به وبلاگ من!', 'این اولین پست وبلاگ من است...', 'دکتر یوسف ندایی', true),
  ('راهنمای مطالعه زیست شناسی', 'در این پست به شما یاد می‌دهم چطور...', 'دکتر یوسف ندایی', true),
  ('تجربه من در کنکور', 'می‌خواهم تجربیاتم را با شما به اشتراک بگذارم...', 'دکتر یوسف ندایی', true);
```

---

## 5. استفاده از Supabase

### 5.1. استفاده از DatabaseService

```typescript
import DatabaseService from './database.service';

// دریافت تمام پست‌ها
const { data, error } = await DatabaseService.getPosts();

if (!error && data) {
  console.log('پست‌ها:', data);
}
```

### 5.2. استفاده از مثال‌های آماده

```typescript
import SupabaseExamples from './supabase.examples';

// اجرای تمام مثال‌ها
await SupabaseExamples.runAllExamples();

// یا استفاده از یک مثال خاص
await SupabaseExamples.exampleGetPosts();
```

### 5.3. اضافه کردن به main.ts

در فایل `src/main.ts` یا `src/app.ts`:

```typescript
// Import کردن Supabase
import './supabase';
import SupabaseExamples from './supabase.examples';

// در یک تابع async
async function init() {
  // بررسی اتصال
  const isConnected = await SupabaseExamples.exampleCheckConnection();
  
  if (isConnected) {
    console.log('✅ اتصال به Supabase برقرار است');
    
    // دریافت پست‌ها
    await SupabaseExamples.exampleGetPosts();
  }
}

// فراخوانی
init();
```

---

## 🎯 مثال‌های کاربردی

### دریافت و نمایش پست‌ها در HTML

```typescript
import DatabaseService from './database.service';

async function displayPosts() {
  const { data, error } = await DatabaseService.getPosts();
  
  if (error) {
    console.error('خطا:', error);
    return;
  }
  
  const container = document.getElementById('posts-container');
  if (!container || !data) return;
  
  data.forEach(post => {
    const postElement = document.createElement('div');
    postElement.className = 'post';
    postElement.innerHTML = `
      <h2>${post.title}</h2>
      <p class="author">نویسنده: ${post.author}</p>
      <div class="content">${post.content}</div>
      <small>${new Date(post.created_at).toLocaleDateString('fa-IR')}</small>
    `;
    container.appendChild(postElement);
  });
}

// فراخوانی
displayPosts();
```

### Real-time Updates

```typescript
import DatabaseService from './database.service';

// اشتراک روی تغییرات جدول posts
const unsubscribe = DatabaseService.subscribeToTable('posts', (payload) => {
  console.log('تغییر جدید:', payload);
  
  if (payload.eventType === 'INSERT') {
    // پست جدید اضافه شد
    const newPost = payload.new;
    // افزودن به لیست پست‌ها در UI
  }
});

// برای لغو اشتراک:
// unsubscribe();
```

---

## 🔒 امنیت

### Row Level Security (RLS)

Supabase از Row Level Security استفاده می‌کند. سیاست‌هایی که ایجاد کردیم:

- **خواندن پست‌ها**: فقط پست‌های منتشر شده قابل مشاهده‌اند
- **خواندن نظرات**: فقط نظرات تایید شده نمایش داده می‌شوند
- **ایجاد نظر**: همه می‌توانند نظر بگذارند (اما باید توسط ادمین تایید شود)

### محافظت از کلیدها

- ❌ هرگز `service_role` key را در frontend استفاده نکنید
- ✅ فقط از `anon` key در frontend استفاده کنید
- ✅ فایل `.env` را به Git push نکنید
- ✅ از متغیرهای محیطی Vercel برای production استفاده کنید

---

## 🚀 دیپلوی در Vercel

1. در داشبورد Vercel، به **Settings > Environment Variables** بروید
2. متغیرهای محیطی را اضافه کنید:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
3. پروژه را rebuild کنید

---

## 📚 منابع

- [مستندات Supabase](https://supabase.com/docs)
- [راهنمای JavaScript/TypeScript](https://supabase.com/docs/reference/javascript/introduction)
- [SQL Editor](https://supabase.com/docs/guides/database/overview)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## ❓ سوالات متداول

**س: آیا Supabase رایگان است؟**  
ج: بله، plan رایگان شامل:
- 500 MB فضای دیتابیس
- 1 GB فضای ذخیره‌سازی فایل
- 2 GB پهنای باند ماهانه
- 50 MB فضای ذخیره‌سازی برای Edge Functions

**س: چطور پسورد دیتابیس را ریست کنم؟**  
ج: Settings > Database > Reset Password

**س: چطور جداول را مدیریت کنم؟**  
ج: از Table Editor یا SQL Editor در داشبورد استفاده کنید

---

✨ **موفق باشید!** اگر سوالی دارید، به [مستندات Supabase](https://supabase.com/docs) مراجعه کنید.
