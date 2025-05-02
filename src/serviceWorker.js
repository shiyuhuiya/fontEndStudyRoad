// 判断当前网页是否运行在本地（开发环境）
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.0/8 are considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export function register(config) {
  // 只有在生产环境 (NODE_ENV === 'production') 并且浏览器支持 Service Worker 的情况下才注册
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // process.env.PUBLIC_URL指的是什么
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    // 检查部署路径是否与当前网站同源（防止跨域问题）。
    if (publicUrl.origin !== window.location.origin) {
      return;
    }
    // 页面加载完成后尝试注册 SW。
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      // 如果是本地开发环境，会进行有效性检查并提示缓存行为。
      if (isLocalhost) {
        // config是register函数的形参
        checkValidServiceWorker(swUrl, config);

        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service ' +
            'worker. To learn more, visit https://bit.ly/CRA-PWA'
          );
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

// 注册 Service Worker。
function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        // 监听 Service Worker 的安装状态。
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log(
                'New content is available and will be used when all ' +
                'tabs for this page are closed. See https://bit.ly/CRA-PWA.'
              );
              // 如果检测到新版本内容可用（即缓存更新），触发 onUpdate 回调
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('Content is cached for offline use.');
              // 如果是首次安装成功，触发 onSuccess 回调。
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

// 请求 SW 文件，确认其存在且格式正确（JavaScript）。
function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // 如果 SW 文件不存在或不是 JS 类型，则注销旧 SW 并刷新页面
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      // 果请求失败（如无网络），提示进入离线模式
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}
// 移除已注册的 Service Worker。
// 适用于不想使用 PWA 缓存功能时调用。
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}
