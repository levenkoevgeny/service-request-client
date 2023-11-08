<template>
  <TopNavView />
  <div class="container">
    <div class="mt-4">
      <h1>
        Заявка от
        {{ getFormattedDateComponent(currentServiceRequest.date_time_created) }}
        {{ getFormattedTimeComponent(currentServiceRequest.date_time_created) }}
      </h1>
      <h5 class="card-title">
        Описание заявки - {{ currentServiceRequest.request_description }}
      </h5>
      <h5 class="card-title">
        Назначенный исполнитель - {{ currentServiceRequest.get_executor_name }}
      </h5>
      <h6
        class="card-title p-1"
        :style="{
          backgroundColor: currentServiceRequest.get_request_status_color,
          display: 'inline',
        }"
      >
        {{ currentServiceRequest.get_request_status_text }}
      </h6>
    </div>
    <div></div>
    <div></div>
    <div></div>
    <div class="mb-5"></div>

    <div
      id="messages"
      class="rounded-top rounded-2"
      style="width: 90%; margin-right: auto; margin-left: auto"
    >
      <h3
        class="p-4 fw-lighter fst-italic"
        style="
          background-color: #0c63e4;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          color: #fff3cd;
        "
      >
        Messages
      </h3>
      <div class="mb-4"></div>
      <template v-for="message in sortedMessages" :key="message.id">
        <div
          v-if="isMessageMine(message)"
          class="d-flex flex-row justify-content-start align-items-start mb-4 px-5"
        >
          <div class="me-5">
            <img
              :src="getAvatar(message.sender.avatar)"
              alt="No picture"
              class="rounded-circle"
              width="70"
              height="70"
            />
          </div>
          <div
            style="
              border-radius: 15px;
              background-color: rgba(57, 192, 237, 0.2);
            "
            class="p-3"
          >
            <p class="fs-3">{{ message.message_text }}</p>
          </div>
        </div>
        <div
          v-else
          class="d-flex flex-row justify-content-end align-items-start mb-4"
        >
          <div
            style="border-radius: 15px; background-color: #fbfbfb"
            class="p-3"
          >
            <p class="fs-3">{{ message.message_text }}</p>
          </div>
          <div class="ms-5">
            <img
              :src="getAvatar(message.sender.avatar)"
              alt="No picture"
              class="rounded-circle"
              width="70"
              height="70"
            />
          </div>
        </div>
      </template>
      <div class="my-3 px-5">
        <form @submit.prevent="sendMessage">
          <textarea
            rows="4"
            class="form-control"
            v-model="typingMessage"
            @keydown.enter.exact.prevent="sendMessage"
            autofocus
          />
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import ReconnectingWebSocket from "reconnecting-websocket"
import { serviceRequestAPI } from "@/api/client/serviceRequestAPI"
import { messagesAPI } from "@/api/admin/messagesAPI"
import { mapGetters, mapState } from "vuex"
import TopNavView from "@/components/common/TopNavView.vue"
import { getFormattedDate, getFormattedTime } from "@/utils"
export default {
  name: "ServiceRequestChatView",
  components: { TopNavView },
  data() {
    return {
      currentServiceRequest: {
        request_sender: null,
        address: "",
        location: null,
        request_status: "",
        request_description: "",
        executor: null,
      },
      chatMessages: { results: [] },
      typingMessage: "",
      isError: false,
      isLoading: true,
      rws: null,
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
    }
  },
  async created() {
    const requestId = this.$route.params.requestId
    await this.loadData(requestId)
    console.log(this.chatMessages)
    this.rws = new ReconnectingWebSocket(
      `ws://localhost:8000/ws/chat/${requestId}/`,
    )

    this.rws.addEventListener("open", () => {
      console.log("ws connect")
    })

    this.rws.addEventListener("message", (e) => {
      this.chatMessages.results.push(JSON.parse(e.data))
      console.log(JSON.parse(e.data))
    })
  },
  methods: {
    async loadData(reqId) {
      this.isError = false
      try {
        const responseServiceRequest = await serviceRequestAPI.getItemData(
          this.userToken,
          reqId,
        )
        if (responseServiceRequest.status === 200) {
          this.currentServiceRequest = responseServiceRequest.data
        } else throw new Error("Service request data error")

        const responseMessages = await messagesAPI.getItemsList(
          this.userToken,
          { service_request: reqId, message_text: "", sender: "" },
        )
        this.chatMessages = await responseMessages.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    sendMessage() {
      this.rws.send(
        JSON.stringify({
          message: this.typingMessage,
          sender: this.userData.id,
          service_request: this.currentServiceRequest.id,
        }),
      )
      this.typingMessage = ""
    },
    getFormattedDateComponent(dateTime) {
      return getFormattedDate(dateTime)
    },
    getFormattedTimeComponent(dateTime) {
      return getFormattedTime(dateTime)
    },
    isMessageMine(message) {
      return message.sender.id === this.userData.id
    },
    getAvatar(uri) {
      const trimmedURI = uri.slice(uri.indexOf("/media"))
      return `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}${trimmedURI}`
    },
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    sortedMessages() {
      return this.chatMessages.results
    },
  },
}
</script>
