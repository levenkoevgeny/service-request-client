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
      <p class="fs-4 fw-bold">
        {{ currentServiceRequest.get_request_status_text }}
      </p>
      <p class="fs-4" v-if="currentServiceRequest.executor">
        <font-awesome-icon
          icon="fa-solid fa-user-nurse"
        />&nbsp;&nbsp;Назначенный исполнитель -
        {{ currentServiceRequest.get_executor_name }}
      </p>
    </div>
    <div
      style="background-color: #ffffff"
      class="p-4 chat-body"
      :style="{
        borderTopColor: currentServiceRequest.get_request_status_color,
      }"
    >
      <div v-for="message in sortedMessages" :key="message.id">
        <div class="message-container mb-3 mx-2">
          <div v-if="isMessageMine(message)">
            <div
              class="d-flex flex-row justify-content-start align-items-start"
            >
              <div class="d-flex flex-row align-items-center">
                <div class="me-4">
                  <img
                    v-if="message.sender_data.avatar"
                    :src="getAvatar(message.sender_data.avatar)"
                    alt="No picture"
                    class="rounded-circle"
                    width="70"
                    height="70"
                  />
                  <div
                    v-else
                    class="rounded-circle d-flex justify-content-center align-items-center default-avatar"
                  >
                    <p class="m-0 p-0 fs-3" style="color: #dee2e6">
                      {{ getDefaultAvatarText() }}
                    </p>
                  </div>
                </div>

                <div class="d-flex flex-column" style="width: 80%">
                  <small class="fst-italic py-1">
                    {{
                      getFormattedDateComponent(message.date_time_created)
                    }}&nbsp;
                    {{ getFormattedTimeComponent(message.date_time_created) }}
                  </small>
                  <p
                    class="message-text p-3 rounded-2"
                    style="background-color: #e8f1f3"
                  >
                    {{ message.message_text }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div
              class="d-flex flex-row justify-content-start align-items-start"
            >
              <div
                class="d-flex flex-row align-items-center justify-content-end"
              >
                <div class="d-flex flex-column" style="width: 80%">
                  <small class="fst-italic py-1 ms-auto">
                    {{
                      getFormattedDateComponent(message.date_time_created)
                    }}&nbsp;
                    {{ getFormattedTimeComponent(message.date_time_created) }}
                  </small>
                  <p
                    class="message-text p-3 rounded-2"
                    style="background-color: #efefef"
                  >
                    {{ message.message_text }}
                  </p>
                </div>
                <div class="ms-4">
                  <img
                    v-if="message.sender_data.avatar"
                    :src="getAvatar(message.sender_data.avatar)"
                    alt="No picture"
                    class="rounded-circle"
                    width="70"
                    height="70"
                  />

                  <div
                    v-else
                    class="rounded-circle d-flex justify-content-center align-items-center"
                    style="width: 70px; height: 70px; background-color: #c4bdbd"
                  >
                    <p class="m-0 p-0 fs-3" style="color: #dee2e6">
                      {{ getDefaultAvatarText() }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mb-3 mx-2">
        <form @submit.prevent="sendMessage">
          <div class="input-group">
            <button
              class="btn btn-primary input-group-text fs-4"
              style="width: 60px"
              type="submit"
              :disabled="typingMessageLength()"
            >
              <font-awesome-icon icon="fa-solid fa-paper-plane" />
            </button>

            <textarea
              rows="2"
              class="form-control"
              aria-label="With textarea"
              v-model="typingMessage"
              required
              autofocus
            />
          </div>
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
          if (!message.is_read && message.sender_data.id !== this.userData.id) {
            await messagesAPI.updateItem(this.userToken, {
              ...message,
              isRead: true,
            })
          }
        })
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async sendMessage() {
      await messagesAPI.addItem(this.userToken, {
        message_text: this.typingMessage,
        sender: this.userData.id,
        service_request: this.currentServiceRequest.id,
      })
      this.typingMessage = ""
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
    typingMessageLength() {
      return this.typingMessage.length === 0
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
