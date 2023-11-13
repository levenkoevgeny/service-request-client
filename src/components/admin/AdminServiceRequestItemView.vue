<template>
  <div class="container">
    <div class="shadow p-3 my-5 bg-body rounded">
      <div class="container-fluid">
        <h5 class="my-3">
          <font-awesome-icon icon="fa-solid fa-calendar-days" />&nbsp;&nbsp;
          {{
            getFormattedDateComponent(currentServiceRequest.date_time_created)
          }}
          <font-awesome-icon icon="fa-solid fa-clock" />&nbsp;&nbsp;
          {{
            getFormattedTimeComponent(currentServiceRequest.date_time_created)
          }}
        </h5>
        <div class="row">
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label">Отправитель</label>
              <select
                class="form-select"
                v-model="currentServiceRequest.request_sender"
                required
              >
                <option value="">----</option>
                <option
                  v-for="user in sortedUsersList"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.username }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label">Исполнитель</label>
              <select
                class="form-select"
                v-model="currentServiceRequest.executor"
                required
              >
                <option value="">----</option>
                <option
                  v-for="user in sortedExecutorsList"
                  :key="user.id"
                  :value="user.id"
                >
                  {{ user.username }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label">Учебный корпус</label>
              <select
                v-model="currentServiceRequest.location"
                class="form-select"
                required
              >
                <option
                  :value="location.id"
                  v-for="location in sortedLocationsList"
                  :key="location.id"
                >
                  {{ location.location }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label">Статус</label>
              <select
                v-model="currentServiceRequest.request_status"
                class="form-select"
                required
              >
                <option
                  :value="status.id"
                  v-for="status in sortedStatusesList"
                  :key="status.id"
                >
                  {{ status.status }}
                </option>
              </select>
            </div>
          </div>
          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Адрес</label>
              <input
                type="text"
                class="form-control"
                v-model="currentServiceRequest.address"
                required
              />
            </div>
          </div>

          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Описание неисправности</label>
              <textarea
                type="text"
                class="form-control"
                v-model="currentServiceRequest.request_description"
                rows="4"
              />
            </div>
          </div>
        </div>
      </div>
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
import { serviceRequestAPI } from "@/api/admin/serviceRequestAPI"
import { messagesAPI } from "@/api/admin/messagesAPI"
import { mapGetters } from "vuex"
import { getFormattedDate, getFormattedTime } from "@/utils"
import { usersAPI } from "@/api/admin/usersAPI"
import { locationAPI } from "@/api/admin/locationAPI"
import { statusAPI } from "@/api/admin/statusAPI"
import debounce from "lodash.debounce"
import Spinner from "@/components/common/Spinner.vue"
import ChatView from "@/components/common/ChatView.vue"

export default {
  name: "AdminServiceRequestItemView",
  components: { Spinner, ChatView },
  data() {
    return {
      chatMessages: { results: [] },
      locationList: { results: [] },
      usersList: { results: [] },
      statusesList: { results: [] },
      executorList: { results: [] },
      currentServiceRequest: {
        request_sender: null,
        address: "",
        location: null,
        request_status: "",
        request_description: "",
        executor: null,
      },
      isError: false,
      isLoading: true,
      rws_serviceRequest: null,
      rws_messages: null,
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
  mounted() {},
  unmounted() {
    this.rws_serviceRequest = null
    this.rws_messages = null
  },
  methods: {
    async loadData(requestId) {
      try {
        const serviceResponse = await serviceRequestAPI.getItemData(
          this.userToken,
          requestId,
        )
        this.currentServiceRequest = await serviceResponse.data

        const messageResponse = await messagesAPI.getItemsList(this.userToken, {
          service_request: requestId,
          message_text: "",
          sender: "",
        })
        this.chatMessages = await messageResponse.data

        const responseUsers = await usersAPI.getItemsList(this.userToken)
        this.usersList = await responseUsers.data

        const responseExecutors = await usersAPI.getItemsList(this.userToken, {
          username: "",
          last_name: "",
          is_active: "",
          is_superuser: "",
          can_be_executor: true,
        })
        this.executorList = await responseExecutors.data

        const responseLocations = await locationAPI.getItemsList(this.userToken)
        this.locationList = await responseLocations.data

        const responseStatuses = await statusAPI.getItemsList(this.userToken)
        this.statusesList = await responseStatuses.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    debouncedUpdate: debounce(async function () {
      try {
        await serviceRequestAPI.updateItem(
          this.userToken,
          this.currentServiceRequest,
        )
      } catch (error) {
        this.isError = true
      } finally {
      }
    }, 500),
    getFormattedDateComponent(dateTime) {
      return getFormattedDate(dateTime)
    },
    getFormattedTimeComponent(dateTime) {
      return getFormattedTime(dateTime)
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
    sortedUsersList() {
      return this.usersList.results
    },
    sortedLocationsList() {
      return this.locationList.results
    },
    sortedStatusesList() {
      return this.statusesList.results
    },
    sortedExecutorsList() {
      return this.executorList.results
    },
  },
  watch: {
    currentServiceRequest: {
      handler(newValue, oldValue) {
        this.debouncedUpdate()
      },
      deep: true,
    },
  },
}
</script>
