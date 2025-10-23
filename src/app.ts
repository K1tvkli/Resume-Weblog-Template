import { AnimationManager } from './animations';
import { setCurrentYear, throttle } from './utils';

/**
 * کلاس اصلی برنامه
 */
class App {
    private animationManager: AnimationManager;
    private loadingScreen: HTMLElement | null;

    constructor() {
        this.animationManager = new AnimationManager();
        this.loadingScreen = document.getElementById('loading-screen');
        this.init();
    }

    /**
     * مقداردهی اولیه برنامه
     */
    private init(): void {
        // منتظر بمان تا DOM کامل بارگذاری شود
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    /**
     * زمانی که DOM آماده است
     */
    private onDOMReady(): void {
        console.log('🚀 App initialized with TypeScript!');

        // تنظیم سال جاری
        setCurrentYear();

        // نمایش محتوا و background
        this.showContent();

        // منتظر لود شدن تمام تصاویر و محتوا
        this.waitForAllResources().then(() => {
            // راه‌اندازی انیمیشن‌ها
            this.setupAnimations();

            // راه‌اندازی رویدادها
            this.setupEventListeners();

            // راه‌اندازی افکت‌های موس
            this.setupMouseEffects();

            // پارالاکس اسکرول
            this.setupScrollEffects();

            // مخفی کردن لودینگ با تاخیر بعد از شروع انیمیشن‌ها
            // محاسبه زمان مورد نیاز برای نمایش تمام انیمیشن‌ها
            const animatableElements = document.querySelectorAll('[data-animate]');
            const totalAnimationDelay = animatableElements.length * 150; // هر آیتم 150ms تاخیر داره
            const extraDelay = 300; // تاخیر اضافی برای شروع انیمیشن

            setTimeout(() => {
                this.hideLoadingScreen();
            }, totalAnimationDelay + extraDelay);
        });
    }

    /**
     * نمایش محتوای اصلی و background
     */
    private showContent(): void {
        const app = document.getElementById('app');
        const backgroundImage = document.querySelector('.background-image');
        const gradientOverlay = document.querySelector('.gradient-overlay');

        if (app) {
            (app as HTMLElement).style.opacity = '1';
            (app as HTMLElement).style.visibility = 'visible';
        }

        if (backgroundImage) {
            (backgroundImage as HTMLElement).style.opacity = '1';
            (backgroundImage as HTMLElement).style.visibility = 'visible';
        }

        if (gradientOverlay) {
            (gradientOverlay as HTMLElement).style.opacity = '1';
            (gradientOverlay as HTMLElement).style.visibility = 'visible';
        }

        // اجازه scroll
        document.body.style.overflow = 'auto';
    }

    /**
     * انتظار برای لود شدن تمام تصاویر و منابع
     */
    private waitForAllResources(): Promise<void> {
        return new Promise((resolve) => {
            // اگر همه چیز از قبل لود شده
            if (document.readyState === 'complete') {
                console.log('✅ All resources already loaded');
                setTimeout(resolve, 300);
                return;
            }

            // لیست تمام تصاویر
            const images = Array.from(document.querySelectorAll('img'));
            const backgroundImages = this.getBackgroundImages();
            const allImages = [...images, ...backgroundImages];

            console.log(`📦 Loading ${allImages.length} images...`);

            if (allImages.length === 0) {
                console.log('✅ No images to load');
                setTimeout(resolve, 300);
                return;
            }

            let loadedCount = 0;
            const totalCount = allImages.length;

            const checkAllLoaded = () => {
                loadedCount++;
                console.log(`📸 Loaded ${loadedCount}/${totalCount} images`);

                if (loadedCount >= totalCount) {
                    console.log('✅ All images loaded successfully!');
                    setTimeout(resolve, 300);
                }
            };

            // بررسی هر تصویر
            allImages.forEach((img) => {
                if (img.complete) {
                    checkAllLoaded();
                } else {
                    img.addEventListener('load', checkAllLoaded);
                    img.addEventListener('error', () => {
                        console.warn('⚠️ Image failed to load:', img.src);
                        checkAllLoaded();
                    });
                }
            });

            // timeout برای اطمینان (حداکثر 10 ثانیه)
            setTimeout(() => {
                console.log('⏰ Loading timeout - hiding loading screen');
                resolve();
            }, 10000);
        });
    }

    /**
     * دریافت تصاویر background
     */
    private getBackgroundImages(): HTMLImageElement[] {
        const bgImages: HTMLImageElement[] = [];
        const bgElement = document.querySelector('.background-image');

        if (bgElement) {
            const bgStyle = window.getComputedStyle(bgElement);
            const bgImage = bgStyle.backgroundImage;

            if (bgImage && bgImage !== 'none') {
                const img = new Image();
                const urlMatch = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
                if (urlMatch) {
                    img.src = urlMatch[1];
                    bgImages.push(img);
                }
            }
        }

        return bgImages;
    }

    /**
     * مخفی کردن صفحه لودینگ
     */
    private hideLoadingScreen(): void {
        if (this.loadingScreen) {
            this.loadingScreen.style.opacity = '0';
            setTimeout(() => {
                if (this.loadingScreen) {
                    this.loadingScreen.style.display = 'none';
                }
            }, 500);
        }
    }

    /**
     * راه‌اندازی انیمیشن‌ها
     */
    private setupAnimations(): void {
        // انتخاب همه المنت‌های قابل انیمیت
        const animatableElements = document.querySelectorAll<HTMLElement>(
            '[data-animate]'
        );

        animatableElements.forEach((element, index) => {
            // اضافه کردن تاخیر به ترتیب
            element.style.animationDelay = `${index * 150}ms`;
            this.animationManager.observe(element);
        });
    }

    /**
     * راه‌اندازی رویدادهای کلیک
     */
    private setupEventListeners(): void {
        // Designer Modal
        const designerName = document.getElementById('designerName');
        const designerModal = document.getElementById('designerModal');
        const closeModal = document.getElementById('closeModal');

        if (designerName && designerModal) {
            designerName.addEventListener('click', () => {
                designerModal.classList.add('active');
            });
        }

        if (closeModal && designerModal) {
            closeModal.addEventListener('click', () => {
                designerModal.classList.remove('active');
            });

            // بستن با کلیک روی overlay
            designerModal.addEventListener('click', (e) => {
                if (e.target === designerModal) {
                    designerModal.classList.remove('active');
                }
            });

            // بستن با کلید Escape
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && designerModal.classList.contains('active')) {
                    designerModal.classList.remove('active');
                }
            });
        }

        // فرم تماس
        const contactForm = document.getElementById('contactForm') as HTMLFormElement;
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(contactForm);
            });
        }

        // دکمه‌های شبکه‌های اجتماعی
        const socialButtons = document.querySelectorAll<HTMLAnchorElement>(
            '.social-btn'
        );

        socialButtons.forEach((button) => {
            // افکت موج (Ripple)
            button.addEventListener('mousedown', (e) => {
                this.createRippleEffect(e, button);
            });
        });

        // تگ‌ها
        const tags = document.querySelectorAll<HTMLElement>('.tag');
        tags.forEach((tag) => {
            tag.addEventListener('click', () => {
                tag.classList.add('tag-clicked');
                setTimeout(() => tag.classList.remove('tag-clicked'), 600);
            });
        });
    }

    /**
     * مدیریت ارسال فرم تماس
     */
    private handleFormSubmit(form: HTMLFormElement): void {
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        const contact = formData.get('contact') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

        // بررسی اینکه همه فیلدها پر شده باشند
        if (!name || !name.trim()) {
            this.showNotification('⚠️ لطفاً نام و نام خانوادگی خود را وارد کنید', 'error');
            return;
        }

        if (!contact || !contact.trim()) {
            this.showNotification('⚠️ لطفاً ایمیل، شماره تماس یا آیدی تلگرام خود را وارد کنید', 'error');
            return;
        }

        if (!subject || !subject.trim()) {
            this.showNotification('⚠️ لطفاً موضوع پیام را وارد کنید', 'error');
            return;
        }

        if (!message || !message.trim()) {
            this.showNotification('⚠️ لطفاً متن پیام خود را بنویسید', 'error');
            return;
        }

        console.log('📧 Form submitted:', { name, contact, subject, message });

        // نمایش پیام موفقیت
        this.showNotification('✅ پیام شما با موفقیت ارسال شد!');

        // ریست کردن فرم
        form.reset();

        // اینجا می‌توانید درخواست API برای ارسال ایمیل اضافه کنید
        // fetch('/api/contact', {
        //     method: 'POST',
        //     body: JSON.stringify({ name, email, subject, message }),
        //     headers: { 'Content-Type': 'application/json' }
        // });
    }



    /**
     * ایجاد افکت موج
     */
    private createRippleEffect(
        event: MouseEvent,
        element: HTMLElement
    ): void {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple');

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    }

    /**
     * راه‌اندازی افکت‌های موس
     */
    private setupMouseEffects(): void {
        const cards = document.querySelectorAll<HTMLElement>('.glass-effect');

        cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                this.handleCardMouseMove(e, card);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    /**
     * مدیریت حرکت موس روی کارت‌ها
     */
    private handleCardMouseMove(
        event: MouseEvent,
        card: HTMLElement
    ): void {
        const rect = card.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      scale3d(1.02, 1.02, 1.02)
    `;
    }

    /**
     * راه‌اندازی افکت‌های اسکرول
     */
    private setupScrollEffects(): void {
        const handleScroll = throttle(() => {
            const scrolled = window.pageYOffset;

            // عکس background ثابت می‌ماند و حرکت نمی‌کند
            // افکت پارالاکس حذف شد

            // نمایش/مخفی کردن دکمه اسکرول به بالا
            this.toggleScrollTopButton(scrolled);
        }, 16);

        window.addEventListener('scroll', handleScroll);
    }

    /**
     * نمایش/مخفی کردن دکمه اسکرول به بالا
     */
    private toggleScrollTopButton(scrolled: number): void {
        // می‌توانید در آینده این قابلیت را اضافه کنید
        if (scrolled > 300) {
            // نمایش دکمه
        } else {
            // مخفی کردن دکمه
        }
    }

    /**
     * نمایش نوتیفیکیشن
     */
    private showNotification(message: string, type: 'success' | 'error' = 'success'): void {
        const notification = document.createElement('div');
        notification.className = `notification ${type === 'error' ? 'notification-error' : ''}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// راه‌اندازی برنامه
new App();
