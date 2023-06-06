import { Config, Connect, ConnectEvents, OneTapAuthEventsSDK, ButtonOneTapAuthEventsSDK } from '@vkontakte/superappkit'
import './style.css'

Config.init({
  appId: 51666014, // Тут нужно подставить ID своего приложения.
  _debug: true,

  appSettings: {
    agreements: '',
    promo: '',
    vkc_behavior: '',
    vkc_auth_action: '',
    vkc_brand: '',
    vkc_display_mode: '',
  },
});

Connect.on(ButtonOneTapAuthEventsSDK.SHOW_LOGIN, console.log)
Connect.on(OneTapAuthEventsSDK.LOGIN_SUCCESS, console.log)
Connect.on(OneTapAuthEventsSDK.LOGIN_FAILED, console.log)
Connect.on(OneTapAuthEventsSDK.AUTH_DATA_LOADED, console.log)

const onAuthUser = (event) => {
  console.log(event)
  alert('onAuthUser')

  fetch('https://vk.com', {
    method: 'POST',
    body: event.payload.auth
  })
}

const oneTapAuth = Connect.buttonOneTapAuth({
  callback(event) {
    console.log(event)
    onAuthUser(event)
    const type = event.type;
    if (!type) {
      return;
    }
    switch (type) {
      case ConnectEvents.OneTapAuthEventsSDK.LOGIN_SUCCESS:
        return onAuthUser(event);
      // Для событий PHONE_VALIDATION_NEEDED и FULL_AUTH_NEEDED
      // нужно открыть полноценный VK ID чтобы пользователь
      // дорегистрировался или свалидировал телефон
      case ConnectEvents.OneTapAuthEventsSDK.FULL_AUTH_NEEDED:
      case ConnectEvents.OneTapAuthEventsSDK.PHONE_VALIDATION_NEEDED:
      case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN:
        return Connect.userVisibleAuth({ source: type }).then(onAuthUser, () => alert('Ошибка!'));
      case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN_OPTIONS:
        // Параметр screen: phone позволяет сразу открыть окно ввода телефона
        // в VK ID
        return Connect.userVisibleAuth({ screen: 'phone', source: type }).then(onAuthUser, () => alert('Ошибка!'));
    }
    return;
  },
  options: {
    showAlternativeLogin: true,
    showAgreements: true,
    displayMode: 'default',
    langId: 0,
    buttonSkin: 'primary',
    buttonStyles: {
      borderRadius: 8,
      height: 50,
    },
  },
});

if (oneTapAuth) {
  oneTapAuth.authReadyPromise.then((result) => {
    console.log('authReadyPromise', result);
  }).catch((error) => {
    console.log('authReadyPromise error', error);
  })

  document.body.appendChild(oneTapAuth.getFrame())
}
