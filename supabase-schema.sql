-- =====================================================
-- Supabase Database Schema
-- جداول دیتابیس برای وبلاگ رزومه
-- =====================================================

-- پاک کردن جداول قبلی (اختیاری - فقط برای dev)
-- DROP TABLE IF EXISTS comments CASCADE;
-- DROP TABLE IF EXISTS posts CASCADE;

-- =====================================================
-- جدول پست‌های وبلاگ
-- =====================================================

CREATE TABLE IF NOT EXISTS posts (
  -- شناسه یکتا
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- زمان ایجاد (خودکار)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- زمان آخرین به‌روزرسانی (خودکار)
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  
  -- عنوان پست
  title TEXT NOT NULL CHECK (char_length(title) >= 3 AND char_length(title) <= 200),
  
  -- محتوای پست
  content TEXT NOT NULL CHECK (char_length(content) >= 10),
  
  -- نویسنده
  author TEXT NOT NULL CHECK (char_length(author) >= 2 AND char_length(author) <= 100),
  
  -- وضعیت انتشار
  published BOOLEAN DEFAULT false,
  
  -- تصویر شاخص (اختیاری)
  featured_image TEXT,
  
  -- توضیح کوتاه (excerpt)
  excerpt TEXT CHECK (char_length(excerpt) <= 500),
  
  -- تگ‌ها (آرایه‌ای از رشته‌ها)
  tags TEXT[] DEFAULT '{}',
  
  -- تعداد بازدید
  view_count INTEGER DEFAULT 0,
  
  -- slug برای URL دوستانه
  slug TEXT UNIQUE
);

-- ایجاد تابع برای به‌روزرسانی خودکار updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger برای به‌روزرسانی خودکار updated_at
CREATE TRIGGER update_posts_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ایندکس‌ها برای بهبود کارایی
CREATE INDEX IF NOT EXISTS posts_published_idx ON posts(published);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS posts_author_idx ON posts(author);
CREATE INDEX IF NOT EXISTS posts_slug_idx ON posts(slug);
CREATE INDEX IF NOT EXISTS posts_tags_idx ON posts USING GIN(tags);

-- ایندکس برای جستجوی تمام‌متن
CREATE INDEX IF NOT EXISTS posts_search_idx ON posts USING gin(
  to_tsvector('english', title || ' ' || content)
);

-- =====================================================
-- جدول نظرات
-- =====================================================

CREATE TABLE IF NOT EXISTS comments (
  -- شناسه یکتا
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- زمان ایجاد (خودکار)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  -- شناسه پست مرتبط
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  
  -- نام نویسنده نظر
  author_name TEXT NOT NULL CHECK (char_length(author_name) >= 2 AND char_length(author_name) <= 100),
  
  -- ایمیل نویسنده (اختیاری)
  author_email TEXT CHECK (author_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  
  -- محتوای نظر
  content TEXT NOT NULL CHECK (char_length(content) >= 1 AND char_length(content) <= 1000),
  
  -- وضعیت تایید
  approved BOOLEAN DEFAULT false,
  
  -- نظر والد (برای پاسخ به نظرات)
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE
);

-- ایندکس‌ها
CREATE INDEX IF NOT EXISTS comments_post_id_idx ON comments(post_id);
CREATE INDEX IF NOT EXISTS comments_approved_idx ON comments(approved);
CREATE INDEX IF NOT EXISTS comments_created_at_idx ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments(parent_id);

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- فعال‌سازی RLS برای جدول posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- سیاست خواندن: همه می‌توانند پست‌های منتشر شده را ببینند
CREATE POLICY "پست‌های منتشر شده برای همه قابل مشاهده است"
  ON posts FOR SELECT
  USING (published = true);

-- سیاست نوشتن: فقط کاربران احراز هویت شده می‌توانند پست بنویسند
-- (اگر احراز هویت ندارید، این سیاست را کامنت کنید)
-- CREATE POLICY "فقط کاربران احراز هویت شده می‌توانند پست بنویسند"
--   ON posts FOR INSERT
--   WITH CHECK (auth.role() = 'authenticated');

-- فعال‌سازی RLS برای جدول comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- سیاست خواندن: همه می‌توانند نظرات تایید شده را ببینند
CREATE POLICY "نظرات تایید شده برای همه قابل مشاهده است"
  ON comments FOR SELECT
  USING (approved = true);

-- سیاست نوشتن: همه می‌توانند نظر بگذارند (اما باید تایید شود)
CREATE POLICY "همه می‌توانند نظر بگذارند"
  ON comments FOR INSERT
  WITH CHECK (true);

-- =====================================================
-- توابع کمکی
-- =====================================================

-- تابع برای جستجوی پست‌ها
CREATE OR REPLACE FUNCTION search_posts(search_query TEXT)
RETURNS SETOF posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM posts
  WHERE published = true
    AND (
      title ILIKE '%' || search_query || '%'
      OR content ILIKE '%' || search_query || '%'
      OR author ILIKE '%' || search_query || '%'
    )
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- تابع برای دریافت پست‌های محبوب
CREATE OR REPLACE FUNCTION get_popular_posts(limit_count INTEGER DEFAULT 10)
RETURNS SETOF posts AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM posts
  WHERE published = true
  ORDER BY view_count DESC, created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- تابع برای افزایش شمارنده بازدید
CREATE OR REPLACE FUNCTION increment_post_view(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET view_count = view_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- داده‌های نمونه (اختیاری)
-- =====================================================

-- پست‌های نمونه
INSERT INTO posts (title, content, author, published, excerpt, tags, slug)
VALUES
  (
    'خوش آمدید به وبلاگ من!',
    'سلام! من دکتر یوسف ندایی هستم، دانشجوی پزشکی و مدرس زیست شناسی. در این وبلاگ قصد دارم تجربیات، نکات درسی و مطالب علمی جالب را با شما به اشتراک بگذارم. امیدوارم مطالب این وبلاگ برایتان مفید و جذاب باشد!',
    'دکتر یوسف ندایی',
    true,
    'اولین پست وبلاگ - معرفی و خوش‌آمدگویی',
    ARRAY['معرفی', 'خوش‌آمدید'],
    'welcome-to-my-blog'
  ),
  (
    'راهنمای مطالعه زیست شناسی کنکور',
    'زیست شناسی یکی از مهم‌ترین دروس کنکور است. در این پست می‌خواهم چند نکته کلیدی برای مطالعه بهتر این درس را با شما در میان بگذارم...',
    'دکتر یوسف ندایی',
    true,
    'نکات کلیدی برای مطالعه زیست شناسی',
    ARRAY['کنکور', 'زیست‌شناسی', 'آموزش'],
    'biology-study-guide'
  ),
  (
    'تجربه من در کنکور ۱۴۰۱',
    'در این پست می‌خواهم تجربیات خودم از کنکور ۱۴۰۱ که با رتبه ۱۱۵ به پایان رسید را با شما به اشتراک بگذارم...',
    'دکتر یوسف ندایی',
    true,
    'داستان موفقیتم در کنکور',
    ARRAY['کنکور', 'تجربه', 'انگیزشی'],
    'my-konkour-experience'
  )
ON CONFLICT (slug) DO NOTHING;

-- نظرات نمونه
INSERT INTO comments (post_id, author_name, content, approved)
SELECT 
  p.id,
  'کاربر نمونه',
  'نظر تستی برای پست ' || p.title,
  true
FROM posts p
WHERE p.published = true
LIMIT 3
ON CONFLICT DO NOTHING;

-- =====================================================
-- اطلاعات و آمار
-- =====================================================

-- نمایش تعداد پست‌ها
DO $$
DECLARE
  post_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO post_count FROM posts;
  RAISE NOTICE 'تعداد کل پست‌ها: %', post_count;
END $$;

-- نمایش تعداد نظرات
DO $$
DECLARE
  comment_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO comment_count FROM comments;
  RAISE NOTICE 'تعداد کل نظرات: %', comment_count;
END $$;

-- =====================================================
-- پایان
-- =====================================================

-- موفق باشید! 🚀
