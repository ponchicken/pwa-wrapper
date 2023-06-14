import {
  Config,
  MiniApp,
} from "@vkontakte/superappkit";
import "./style.css";

const superAppToken = 'token';
const appId = 0;
const miniappId = 0;

Config.init({
  appId,
  _debug: true,

  appSettings: {
    agreements: "",
    promo: "",
    vkc_behavior: "",
    vkc_auth_action: "",
    vkc_brand: "",
    vkc_display_mode: "",
  },
  superAppToken
});

openMiniApp();

function openMiniApp() {
  const miniapp = new MiniApp({
    app: miniappId
  });


  miniapp.open({}, "hash");
}
