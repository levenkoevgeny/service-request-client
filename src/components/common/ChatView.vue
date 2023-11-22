<template>
  <div
    style="background-color: #ffffff"
    class="p-4 chat-body chat-container"
    :style="{
      borderTopColor: currentServiceRequest.get_request_status_color,
    }"
  >
    <h5 class="mb-4 fs-4">Обсуждение заявки</h5>
    <div style="max-height: 70%; height: 70%; overflow: auto">
      <div v-for="message in messagesList" :key="message.id">
        <div class="message-container mb-3 mx-2">
          <div v-if="isMessageMine(message)">
            <div class="d-flex flex-row justify-content-end align-items-start">
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
                      {{ getDefaultAvatarText(message.sender_data.username) }}
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
                      {{ getDefaultAvatarText(message.sender_data.username) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="mb-3"
      style="position: absolute; bottom: 0px; width: calc(100% - 48px)"
    >
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
            placeholder="Введите сообщение ..."
            :disabled="currentServiceRequest.get_request_status_block"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { getFormattedDate, getFormattedTime } from "@/utils"
import { messagesAPI } from "@/api/admin/messagesAPI"

export default {
  name: "ChatView",
  data() {
    return {
      typingMessage: "",
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
    }
  },
  props: {
    messagesList: [],
    currentServiceRequest: Object,
    userData: Object,
    userToken: String,
  },
  methods: {
    async sendMessage() {
      try {
        const response = await messagesAPI.addItem(this.userToken, {
          message_text: this.typingMessage,
          sender: this.userData.id,
          service_request: this.currentServiceRequest.id,
        })

        if (response.status === 201) {
          const newMessage = await response.data
          await messagesAPI.sendMessageIsReadByUser(this.userToken, {
            message: newMessage.id,
            who_read: this.userData.id,
          })
        }
      } catch (error) {
      } finally {
        this.typingMessage = ""
      }
    },
    typingMessageLength() {
      return this.typingMessage.length === 0
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
    getDefaultAvatarText(username) {
      return username[0].toUpperCase()
    },
  },
}
</script>
<style>
.chat-container {
  height: 55vh;
  max-height: 55vh;
  position: relative;
}
</style>
