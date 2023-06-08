import {
  Config,
  Connect,
  ConnectEvents,
  OneTapAuthEventsSDK,
  ButtonOneTapAuthEventsSDK,
  MiniApp,
} from "@vkontakte/superappkit";
import "./style.css";

Config.init({
  appId: 51666014, // Тут нужно подставить ID своего приложения.
  _debug: true,

  appSettings: {
    agreements: "",
    promo: "",
    vkc_behavior: "",
    vkc_auth_action: "",
    vkc_brand: "",
    vkc_display_mode: "",
  },
});

Connect.on(ButtonOneTapAuthEventsSDK.SHOW_LOGIN, console.log);
Connect.on(OneTapAuthEventsSDK.LOGIN_SUCCESS, console.log);
Connect.on(OneTapAuthEventsSDK.LOGIN_FAILED, console.log);
Connect.on(OneTapAuthEventsSDK.AUTH_DATA_LOADED, console.log);

const onAuthUser = (event) => {
  console.log(event);

  openMiniApp(event);
};

const oneTapAuth = Connect.buttonOneTapAuth({
  callback(event) {
    console.log(event);
    onAuthUser(event);
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
        return Connect.userVisibleAuth({ source: type }).then(onAuthUser, () =>
          alert("Ошибка!")
        );
      case ConnectEvents.ButtonOneTapAuthEventsSDK.SHOW_LOGIN_OPTIONS:
        // Параметр screen: phone позволяет сразу открыть окно ввода телефона
        // в VK ID
        return Connect.userVisibleAuth({ source: type }).then(onAuthUser, () =>
          alert("Ошибка!")
        );
    }
    return;
  },
  options: {
    showAlternativeLogin: true,
    showAgreements: true,
    displayMode: "default",
    langId: 0,
    buttonSkin: "primary",
    buttonStyles: {
      borderRadius: 8,
      height: 50,
    },
  },
});

if (oneTapAuth) {
  oneTapAuth.authReadyPromise
    .then((result) => {
      console.log("authReadyPromise", result);
    })
    .catch((error) => {
      console.log("authReadyPromise error", error);
    });

  document.body.appendChild(oneTapAuth.getFrame());
}

Config.onAuth((params) => {
  console.log("onAuth", params);
});

function openMiniApp(event) {
  Config.setSuperAppToken(event.payload.token);
  const miniapp = new MiniApp({
    app: 8129498,
  });

  const query = {
    vk_access_token_settings: "",
    vk_app_id: "8129498",
    vk_are_notifications_enabled: "0",
    vk_experiment: "eyIyNjg5IjowLCI0MTk3IjowLCI0NjI5IjowfQ",
    vk_is_app_user: "1",
    vk_is_favorite: "1",
    vk_language: "ru",
    vk_platform: "desktop_web",
    vk_ref: "other",
    vk_testing_group_id: "1",
    vk_ts: "1686038960",
    vk_user_id: "1644767",
    sign: "_-hAq98zkTkwtSsKx3zx6SHXvVlUlf06jnN2JHDeId9g",
  };

  miniapp.preload(query, "hDCzyWMeanMf1uowCtIa");
}
