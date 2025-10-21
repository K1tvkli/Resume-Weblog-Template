/**
 * Interface برای تنظیمات انیمیشن
 */
export interface AnimationConfig {
  duration: number;
  delay: number;
  easing: string;
}

/**
 * Interface برای المنت‌های قابل انیمیت
 */
export interface AnimatableElement {
  element: HTMLElement;
  animationType: string;
  config?: Partial<AnimationConfig>;
}

/**
 * کلاس مدیریت انیمیشن‌ها
 */
export class AnimationManager {
  private observer: IntersectionObserver;
  private defaultConfig: AnimationConfig = {
    duration: 800,
    delay: 0,
    easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );
  }

  /**
   * ثبت المنت برای انیمیشن
   */
  public observe(element: HTMLElement): void {
    this.observer.observe(element);
  }

  /**
   * لغو ثبت المنت
   */
  public unobserve(element: HTMLElement): void {
    this.observer.unobserve(element);
  }

  /**
   * مدیریت برخورد المنت با viewport
   */
  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target as HTMLElement;
        element.classList.add('animated');
        this.unobserve(element);
      }
    });
  }

  /**
   * اجرای انیمیشن روی یک المنت
   */
  public animate(
    element: HTMLElement,
    animation: string,
    config?: Partial<AnimationConfig>
  ): Promise<void> {
    return new Promise((resolve) => {
      const finalConfig = { ...this.defaultConfig, ...config };
      
      element.style.animationDuration = `${finalConfig.duration}ms`;
      element.style.animationDelay = `${finalConfig.delay}ms`;
      element.style.animationTimingFunction = finalConfig.easing;
      
      element.classList.add(animation);
      
      element.addEventListener('animationend', () => {
        resolve();
      }, { once: true });
    });
  }
}
