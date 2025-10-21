/**
 * تبدیل اعداد انگلیسی به فارسی
 */
export function toPersianNumber(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/\d/g, (digit) => persianDigits[parseInt(digit)]);
}

/**
 * تنظیم سال جاری در فوتر
 */
export function setCurrentYear(): void {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    const currentYear = new Date().getFullYear();
    yearElement.textContent = toPersianNumber(currentYear);
  }
}

/**
 * Throttle برای بهینه‌سازی رویدادها
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (this: any, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Debounce برای بهینه‌سازی رویدادها
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

/**
 * اضافه کردن کلاس با تاخیر
 */
export function addClassWithDelay(
  element: HTMLElement,
  className: string,
  delay: number
): void {
  setTimeout(() => {
    element.classList.add(className);
  }, delay);
}

/**
 * انیمیشن اسکرول صاف
 */
export function smoothScrollTo(targetY: number, duration: number = 600): void {
  const startY = window.pageYOffset;
  const difference = targetY - startY;
  const startTime = performance.now();

  function step(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = easeInOutCubic(progress);

    window.scrollTo(0, startY + difference * easeProgress);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

/**
 * تابع easing
 */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
