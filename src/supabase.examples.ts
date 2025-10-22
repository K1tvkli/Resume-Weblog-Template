/**
 * فایل نمونه برای نمایش نحوه استفاده از Supabase
 * این فایل شامل مثال‌های مختلف برای کار با دیتابیس است
 */

import DatabaseService from './database.service';
import { supabase } from './supabase';

/**
 * مثال 1: دریافت تمام پست‌ها
 */
export async function exampleGetPosts() {
    console.log('📖 دریافت تمام پست‌ها...');

    const { data, error } = await DatabaseService.getPosts();

    if (error) {
        console.error('خطا:', error.message);
        return;
    }

    console.log('پست‌های دریافت شده:', data);

    // نمایش پست‌ها در صفحه
    if (data) {
        data.forEach(post => {
            console.log(`- ${post.title} توسط ${post.author}`);
        });
    }
}

/**
 * مثال 2: ایجاد پست جدید
 */
export async function exampleCreatePost() {
    console.log('✏️ ایجاد پست جدید...');

    const newPost = {
        title: 'عنوان پست نمونه',
        content: 'این یک محتوای نمونه برای پست است...',
        author: 'دکتر یوسف ندایی',
        published: true,
    };

    const { data, error } = await DatabaseService.createPost(newPost);

    if (error) {
        console.error('خطا:', error.message);
        return;
    }

    console.log('پست جدید ایجاد شد:', data);
}

/**
 * مثال 3: جستجو در پست‌ها
 */
export async function exampleSearchPosts(query: string) {
    console.log(`🔍 جستجو برای: "${query}"`);

    const { data, error } = await DatabaseService.searchPosts(query);

    if (error) {
        console.error('خطا:', error.message);
        return;
    }

    console.log(`${data?.length || 0} نتیجه یافت شد:`, data);
}

/**
 * مثال 4: دریافت نظرات یک پست
 */
export async function exampleGetComments(postId: string) {
    console.log('💬 دریافت نظرات...');

    const { data, error } = await DatabaseService.getCommentsByPostId(postId);

    if (error) {
        console.error('خطا:', error.message);
        return;
    }

    console.log('نظرات:', data);
}

/**
 * مثال 5: ایجاد نظر جدید
 */
export async function exampleCreateComment(postId: string) {
    console.log('💭 ایجاد نظر جدید...');

    const newComment = {
        post_id: postId,
        author_name: 'کاربر نمونه',
        content: 'این یک نظر تستی است',
        approved: false, // نیاز به تایید دارد
    };

    const { data, error } = await DatabaseService.createComment(newComment);

    if (error) {
        console.error('خطا:', error.message);
        return;
    }

    console.log('نظر ایجاد شد:', data);
}

/**
 * مثال 6: استفاده از Realtime برای دریافت تغییرات لحظه‌ای
 */
export function exampleRealtimeSubscription() {
    console.log('🔴 فعال‌سازی اشتراک Realtime...');

    // اشتراک روی جدول posts
    const unsubscribe = DatabaseService.subscribeToTable('posts', (payload) => {
        console.log('🔔 تغییر جدید در پست‌ها:', payload);

        switch (payload.eventType) {
            case 'INSERT':
                console.log('➕ پست جدید:', payload.new);
                break;
            case 'UPDATE':
                console.log('✏️ پست به‌روزرسانی شد:', payload.new);
                break;
            case 'DELETE':
                console.log('🗑️ پست حذف شد:', payload.old);
                break;
        }
    });

    // برای لغو اشتراک بعداً:
    // unsubscribe();

    return unsubscribe;
}

/**
 * مثال 7: استفاده مستقیم از Supabase client برای کوئری پیشرفته
 */
export async function exampleAdvancedQuery() {
    console.log('🎯 کوئری پیشرفته...');

    try {
        // مثال: دریافت پست‌های اخیر با تعداد نظرات
        const { data, error } = await supabase
            .from('posts')
            .select(`
        *,
        comments:comments(count)
      `)
            .eq('published', true)
            .order('created_at', { ascending: false })
            .limit(10);

        if (error) throw error;

        console.log('پست‌های اخیر با تعداد نظرات:', data);
    } catch (error) {
        console.error('خطا:', error);
    }
}

/**
 * مثال 8: بررسی وضعیت اتصال
 */
export async function exampleCheckConnection() {
    console.log('🔌 بررسی اتصال به Supabase...');

    try {
        // تلاش برای دریافت تعداد پست‌ها
        const { count, error } = await supabase
            .from('posts')
            .select('*', { count: 'exact', head: true });

        if (error) {
            console.error('❌ خطا در اتصال:', error.message);
            return false;
        }

        console.log(`✅ اتصال موفق! تعداد پست‌ها: ${count}`);
        return true;
    } catch (error) {
        console.error('❌ خطای اتصال:', error);
        return false;
    }
}

/**
 * تابع اصلی برای تست تمام مثال‌ها
 */
export async function runAllExamples() {
    console.log('🚀 اجرای تمام مثال‌ها...\n');

    // بررسی اتصال
    const isConnected = await exampleCheckConnection();
    if (!isConnected) {
        console.error('❌ لطفاً اطلاعات اتصال را در .env تنظیم کنید');
        return;
    }

    console.log('\n---\n');

    // سایر مثال‌ها
    await exampleGetPosts();
    console.log('\n---\n');

    await exampleSearchPosts('زیست');
    console.log('\n---\n');

    // فعال‌سازی Realtime

    console.log('\n✅ تمام مثال‌ها اجرا شدند!');
    console.log('💡 برای لغو اشتراک Realtime، unsubscribe() را فراخوانی کنید');
}

// Export برای استفاده در app.ts یا main.ts
export default {
    exampleGetPosts,
    exampleCreatePost,
    exampleSearchPosts,
    exampleGetComments,
    exampleCreateComment,
    exampleRealtimeSubscription,
    exampleAdvancedQuery,
    exampleCheckConnection,
    runAllExamples,
};
