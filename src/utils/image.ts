export function getAssetsImages(name: string) {
  return new URL(`/src/assets/${name}`, import.meta.url).href;
}
export function isInTimeRange(timeStrOrRangeStr: string) {
  const parts = timeStrOrRangeStr.split('-');

  if (parts.length === 1) {  // 单个时间
    const target = new Date(parts[0]);
    const current = new Date();

    if (current >= target) {
      return true;
    } else {
      return false;
    }
  } else if (parts.length === 2) {  // 时间范围
    const start = new Date(parts[0]);
    const end = new Date(parts[1]);
    const current = new Date();

    return current >= start && current <= end;
  } else {
    throw new Error('输入的时间格式不正确');
  }
}
export function downloadByBinary(blob: Blob | MediaSource, fileNameTimestamp: any, fileType: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `2024年度战报${fileNameTimestamp}.${fileType.split('/')[1]}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
export function showToast(message: string | null) {
  const toastContainer = document.createElement('div');
  toastContainer.classList.add('toast');
  toastContainer.textContent = message;
  document.body.appendChild(toastContainer);

  setTimeout(() => {
    toastContainer.classList.add('fade-out');
    // setTimeout(() => {
    //   document.body.removeChild(toastContainer);
    // }, 500);
  }, 2000);
}
export function isWechat() {
  return /MicroMessenger/i.test(window.navigator.userAgent);
}
export function showImagePreview(imageUrls: any[]) {
  const previewContainer = document.createElement('div');
  previewContainer.classList.add('image-preview-container');

  imageUrls.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    previewContainer.appendChild(img);
  });

  document.body.appendChild(previewContainer);
}
export function getEnvironment() {
  var ua = navigator.userAgent.toLowerCase();
  var isWeChat = ua.indexOf('micromessenger') !== -1;
  var isQQBrowser = ua.indexOf('qq/') !== -1;
  if (isWeChat || isQQBrowser) {
    return true;
  } else {
    return false;
  }
  // const u = navigator.userAgent,
  //   isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
  //   isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
  // if (isiOS) {
  //   try {//app内
  //     console.log('app内');

  //     return true;
  //   } catch (error) {//浏览器内
  //     console.log('浏览器内');

  //     return false;
  //   }
  // } else if (isAndroid) {
  //   if (window.native) {//app内
  //     console.log('app内');
  //     return true;
  //   } else {//浏览器内
  //     console.log('浏览器内');
  //     return false;
  //   }
  // }

}
export function debounce<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function(this: ThisParameterType<T>,...args: Parameters<T>) {
        if (timer) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
/**
 * 创建一个节流函数
 * @param func 需要节流的函数
 * @param delay 节流的时间间隔，单位为毫秒
 * @returns 节流后的函数
 */
export function throttle(func: (...args: any[]) => void, delay: number): (...args: any[]) => void {
    let timer: number | null = null;
    return function(this: any,...args: any[]): void {
        if (!timer) {
            func.apply(this, args);
            timer = setTimeout(() => {
                timer = null;
            }, delay) as any;
        }
    };
}
