import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"
import store from "./store"
import { library } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome"

import { faCalendarDays } from "@fortawesome/free-solid-svg-icons"
import { faClock } from "@fortawesome/free-solid-svg-icons"
import { faMessage } from "@fortawesome/free-solid-svg-icons"
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons"
import { faUserNurse } from "@fortawesome/free-solid-svg-icons"
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons"

library.add(faCalendarDays)
library.add(faClock)
library.add(faMessage)
library.add(faTriangleExclamation)
library.add(faUserNurse)
library.add(faPaperPlane)

createApp(App)
  .component("font-awesome-icon", FontAwesomeIcon)
  .use(store)
  .use(router)
  .mount("#app")
