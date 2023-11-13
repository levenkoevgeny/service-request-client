<template>
  <TopNavView />
  <div class="container">
    <div class="mt-5">
      <p class="fs-4">
        <font-awesome-icon icon="fa-solid fa-calendar-days" />&nbsp;&nbsp;
        {{
          getFormattedDateComponent(currentServiceRequest.date_time_created)
        }}&nbsp;&nbsp;&nbsp;&nbsp;
        <font-awesome-icon icon="fa-solid fa-clock" />&nbsp;&nbsp;{{
          getFormattedTimeComponent(currentServiceRequest.date_time_created)
        }}
      </p>
      <p class="fs-4 fst-italic">
        <font-awesome-icon
          icon="fa-solid fa-triangle-exclamation"
        />&nbsp;&nbsp;{{ currentServiceRequest.request_description }}
      </p>
      <p class="fs-4">
        Статус заявки -
        <span class="fw-bold">{{
          currentServiceRequest.get_request_status_text
        }}</span>
      </p>
      <p class="fs-4" v-if="currentServiceRequest.executor">
        <font-awesome-icon
          icon="fa-solid fa-user-nurse"
        />&nbsp;&nbsp;Назначенный исполнитель -
        {{ currentServiceRequest.get_executor_name }}
      </p>
    </div>

    <ChatView
      :messages-list="sortedMessages"
      :user-data="userData"
      :current-service-request="currentServiceRequest"
      :user-token="userToken"
    />
  </div>
</template>
<script>
import ReconnectingWebSocket from "reconnecting-websocket"
import { serviceRequestAPI } from "@/api/client/serviceRequestAPI"
import { messagesAPI } from "@/api/admin/messagesAPI"
import { mapGetters, mapState } from "vuex"
import TopNavView from "@/components/common/TopNavView.vue"
import ChatView from "@/components/common/ChatView.vue"
import { getFormattedDate, getFormattedTime } from "@/utils"
export default {
  name: "ServiceRequestChatView",
  components: { TopNavView, ChatView },
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
    this.rws = new ReconnectingWebSocket(
      `ws://${this.BACKEND_HOST}:${this.BACKEND_PORT}/ws/chat/${requestId}/`,
    )

    this.rws.addEventListener("open", () => {})

    this.rws.addEventListener("message", async (e) => {
      const messageFromWebSocket = JSON.parse(e.data)
      let thereIsMessage = false
      let newChatMessages = this.chatMessages.results.map((message) => {
        if (message.id === messageFromWebSocket.id) {
          thereIsMessage = true
          return messageFromWebSocket
        } else {
          return message
        }
      })

      if (!thereIsMessage) {
        this.chatMessages.results.push(messageFromWebSocket)
        if (messageFromWebSocket.sender_data.id !== this.userData.id) {
          await messagesAPI.updateItem(this.userToken, {
            ...messageFromWebSocket,
            is_read: true,
          })
        }
      } else {
        this.chatMessages.results = newChatMessages
      }
    })
  },
  unmounted() {
    this.rws = null
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

        this.chatMessages.results.map(async (message) => {
          if (!message.is_read && message.sender !== this.userData.id) {
            await messagesAPI.updateItem(this.userToken, {
              ...message,
              is_read: true,
            })
          }
        })
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    getFormattedDateComponent(dateTime) {
      return getFormattedDate(dateTime)
    },
    getFormattedTimeComponent(dateTime) {
      return getFormattedTime(dateTime)
    },
    isMessageMine(message) {
      return message.sender_data.id === this.userData.id
    },
    getAvatar(uri) {
      const trimmedURI = uri.slice(uri.indexOf("/media"))
      return `${this.BACKEND_PROTOCOL}://${this.BACKEND_HOST}:${this.BACKEND_PORT}${trimmedURI}`
    },
    getDefaultAvatarText() {
      return this.userData.username[0].toUpperCase()
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
