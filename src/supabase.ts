/**
 * پیکربندی و راه‌اندازی Supabase Client
 * این فایل مسئول اتصال به دیتابیس Supabase است
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// دریافت اطلاعات اتصال از متغیرهای محیطی
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || '';

// بررسی وجود اطلاعات اتصال
if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ خطا: اطلاعات اتصال Supabase یافت نشد!');
    console.error('لطفاً فایل .env را با SUPABASE_URL و SUPABASE_ANON_KEY تنظیم کنید.');
}

// ایجاد Supabase client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // تنظیمات احراز هویت
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    // تنظیمات Realtime (اختیاری)
    realtime: {
        params: {
            eventsPerSecond: 10
        }
    }
});

// لاگ موفقیت‌آمیز بودن اتصال
if (supabaseUrl && supabaseAnonKey) {
    console.log('%c✅ Supabase Client initialized successfully!', 'color: #3ecf8e; font-weight: bold;');
    console.log(`📡 Connected to: ${supabaseUrl}`);
}

/**
 * تایپ‌های پایه برای دیتابیس (می‌توانید بر اساس schema خود تغییر دهید)
 */
export interface Database {
    public: {
        Tables: {
            // مثال: جدول پست‌های وبلاگ
            posts: {
                Row: {
                    id: string;
                    created_at: string;
                    title: string;
                    content: string;
                    author: string;
                    published: boolean;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    title: string;
                    content: string;
                    author: string;
                    published?: boolean;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    title?: string;
                    content?: string;
                    author?: string;
                    published?: boolean;
                };
            };
            // مثال: جدول نظرات
            comments: {
                Row: {
                    id: string;
                    created_at: string;
                    post_id: string;
                    author_name: string;
                    content: string;
                    approved: boolean;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    post_id: string;
                    author_name: string;
                    content: string;
                    approved?: boolean;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    post_id?: string;
                    author_name?: string;
                    content?: string;
                    approved?: boolean;
                };
            };
        };
    };
}

// Export کردن client با type safety
export type TypedSupabaseClient = SupabaseClient<Database>;
export const typedSupabase = supabase as TypedSupabaseClient;

export default supabase;
