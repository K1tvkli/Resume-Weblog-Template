/**
 * سرویس دیتابیس برای مدیریت عملیات‌های Supabase
 * این کلاس شامل متدهای کمکی برای کار با دیتابیس است
 */

import type { PostgrestError } from '@supabase/supabase-js';
import { supabase } from './supabase';

// تایپ‌های دیتابیس
interface Post {
    id: string;
    created_at: string;
    title: string;
    content: string;
    author: string;
    published: boolean;
}

interface PostInsert {
    id?: string;
    created_at?: string;
    title: string;
    content: string;
    author: string;
    published?: boolean;
}

interface PostUpdate {
    id?: string;
    created_at?: string;
    title?: string;
    content?: string;
    author?: string;
    published?: boolean;
}

interface Comment {
    id: string;
    created_at: string;
    post_id: string;
    author_name: string;
    content: string;
    approved: boolean;
}

interface CommentInsert {
    id?: string;
    created_at?: string;
    post_id: string;
    author_name: string;
    content: string;
    approved?: boolean;
}

/**
 * کلاس سرویس دیتابیس
 * شامل متدهای مختلف برای عملیات CRUD
 */
export class DatabaseService {
    /**
     * دریافت تمام پست‌های منتشر شده
     */
    static async getPosts(): Promise<{ data: Post[] | null; error: PostgrestError | null }> {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ خطا در دریافت پست‌ها:', error);
                return { data: null, error };
            }

            console.log(`✅ ${data?.length || 0} پست دریافت شد`);
            return { data, error: null };
        } catch (err) {
            console.error('❌ خطای غیرمنتظره:', err);
            return { data: null, error: err as PostgrestError };
        }
    }

    /**
     * دریافت یک پست بر اساس ID
     */
    static async getPostById(id: string): Promise<{ data: Post | null; error: PostgrestError | null }> {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('❌ خطا در دریافت پست:', error);
                return { data: null, error };
            }

            console.log('✅ پست دریافت شد:', data.title);
            return { data, error: null };
        } catch (err) {
            console.error('❌ خطای غیرمنتظره:', err);
            return { data: null, error: err as PostgrestError };
        }
    }

    /**
     * ایجاد پست جدید
     */
    static async createPost(post: PostInsert): Promise<{ data: Post | null; error: PostgrestError | null }> {
        try {
            const { data, error } = await supabase
                .from('posts')
                .insert(post)
                .select()
                .single();

            if (error) {
                console.error('❌ خطا در ایجاد پست:', error);
                return { data: null, error };
            }

            console.log('✅ پست جدید ایجاد شد:', data.title);
            return { data, error: null };
        } catch (err) {
            console.error('❌ خطای غیرمنتظره:', err);
            return { data: null, error: err as PostgrestError };
        }
    }

    /**
     * به‌روزرسانی پست
     */
    static async updatePost(id: string, updates: PostUpdate): Promise<{ data: Post | null; error: PostgrestError | null }> {
        try {
            const { data, error } = await supabase
                .from('posts')
                .update(updates)
                .eq('id', id)
                .select()
                .single();

            if (error) {
                console.error('❌ خطا در به‌روزرسانی پست:', error);
                return { data: null, error };
            }

            console.log('✅ پست به‌روزرسانی شد:', data.title);
            return { data, error: null };
        } catch (err) {
            console.error('❌ خطای غیرمنتظره:', err);
            return { data: null, error: err as PostgrestError };
        }
    }

    /**
     * حذف پست
     */
    static async deletePost(id: string): Promise<{ error: PostgrestError | null }> {
        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('❌ خطا در حذف پست:', error);
                return { error };
            }

            console.log('✅ پست حذف شد');
            return { error: null };
        } catch (err) {
            console.error('❌ خطای غیرمنتظره:', err);
            return { error: err as PostgrestError };
        }
    }

    /**
     * دریافت نظرات یک پست
     */
    static async getCommentsByPostId(postId: string): Promise<{ data: Comment[] | null; error: PostgrestError | null }> {
        try {
            const { data, error } = await supabase
                .from('comments')
                .select('*')
                .eq('post_id', postId)
                .eq('approved', true)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ خطا در دریافت نظرات:', error);
                return { data: null, error };
            }

            console.log(`✅ ${data?.length || 0} نظر دریافت شد`);
            return { data, error: null };
        } catch (err) {
            console.error('❌ خطای غیرمنتظره:', err);
            return { data: null, error: err as PostgrestError };
        }
    }

    /**
     * ایجاد نظر جدید
     */
    static async createComment(comment: CommentInsert): Promise<{ data: Comment | null; error: PostgrestError | null }> {
        try {
            const { data, error } = await supabase
                .from('comments')
                .insert(comment)
                .select()
                .single();

            if (error) {
                console.error('❌ خطا در ایجاد نظر:', error);
                return { data: null, error };
            }

            console.log('✅ نظر جدید ایجاد شد');
            return { data, error: null };
        } catch (err) {
            console.error('❌ خطای غیرمنتظره:', err);
            return { data: null, error: err as PostgrestError };
        }
    }

    /**
     * جستجو در پست‌ها
     */
    static async searchPosts(query: string): Promise<{ data: Post[] | null; error: PostgrestError | null }> {
        try {
            const { data, error } = await supabase
                .from('posts')
                .select('*')
                .eq('published', true)
                .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('❌ خطا در جستجو:', error);
                return { data: null, error };
            }

            console.log(`✅ ${data?.length || 0} نتیجه یافت شد`);
            return { data, error: null };
        } catch (err) {
            console.error('❌ خطای غیرمنتظره:', err);
            return { data: null, error: err as PostgrestError };
        }
    }

    /**
     * اشتراک روی تغییرات Real-time یک جدول
     * مثال استفاده:
     * DatabaseService.subscribeToTable('posts', (payload) => {
     *   console.log('تغییرات جدید:', payload);
     * });
     */
    static subscribeToTable(
        tableName: string,
        callback: (payload: any) => void
    ) {
        const channel = supabase
            .channel(`public:${tableName}`)
            .on(
                'postgres_changes' as any,
                {
                    event: '*', // می‌تواند 'INSERT', 'UPDATE', 'DELETE' یا '*' باشد
                    schema: 'public',
                    table: tableName,
                },
                callback
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`✅ اشتراک روی جدول ${tableName} فعال شد`);
                }
            });

        // تابع برای لغو اشتراک
        return () => {
            supabase.removeChannel(channel);
            console.log(`❌ اشتراک روی جدول ${tableName} لغو شد`);
        };
    }
}

// Export برای استفاده در سایر فایل‌ها
export default DatabaseService;
