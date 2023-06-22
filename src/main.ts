import {
  Config,
  MiniApp,
} from '@vkontakte/superappkit';
import './style.css';

const superAppToken = 'token';
const appId = 0;
const miniappId = 0;

Config.init({
  appId,
  _debug: true,
  /**
   * в моем случае мини апп открывается по адресу
   * https://tk-sky.id.cs7777.vk.com/mini_app?app=app7787819&host_app_id=5166601
   * И все запросы на login, api уходят относительно этого домена
   */
  connectDomain: 'tk-sky.id.cs7777.vk.com',

  appSettings: {
    agreements: '',
    promo: '',
    vkc_behavior: '',
    vkc_auth_action: '',
    vkc_brand: '',
    vkc_display_mode: '',
  },
  superAppToken,
});

const handleRequestSuerAppToken = (params, options) => {
  console.log('handleRequestSuerAppToken', params, options);

  return Promise.resolve(superAppToken);
};

/**
 * для подписки нужно вызвать метод (не переопределить его) и передать функцию, которая вернет промис с SAT
 */
Config.onRequestSuperAppToken(handleRequestSuerAppToken);

openMiniApp();

function openMiniApp() {
  const miniapp = new MiniApp({
    app: miniappId,

  });

  /**
   * делает miniapp.preload() и открывает созданный iframe
   */
  miniapp.open();

  /**
   * Событие должно отправляться после подготовки создания(подготовки) айфрейма, а именно miniapp.preload
   * Важно, чтобы выполнялись проверки
   *     if (!this.config.origin || event.origin !== this.config.origin) {
   *       return;
   *     }
   *
   *     if (event.source !== this.config.iframe.contentWindow) {
   *       return;
   *     }
   *
   *     if (!(event.data && event.data.type === BRIDGE_MESSAGE_TYPE_SDK)) {
   *       return;
   *     }
   */
  setTimeout(() => {
    window.parent.postMessage({
      handler: 'VKSDKGeneralSuperAppToken',
      params: {
        refresh: true,
      },
      type: 'vk-sak-sdk',
    });
  }, 1000);

  /**
   *   Можно так
   *   miniapp.preload().then(() => {
   *     miniapp.show();
   *
   *       window.parent.postMessage({
   *         handler: 'VKSDKGeneralSuperAppToken',
   *           params: {
   *           refresh: true,
   *         },
   *         type: 'vk-sak-sdk',
   *       });
   *   })
   */
}
