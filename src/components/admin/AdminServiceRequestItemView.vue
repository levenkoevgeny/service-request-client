<template>
  <div>
    <div class="modal-body">
      <div class="container-fluid">
        <div class="row">
          <div class="col-12">
            <div class="mb-3">
              <label class="form-label">Отправитель</label>
              <p>{{ currentServiceRequest.request_sender }}</p>
            </div>
          </div>

          <div class="col-12">
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
              <label class="form-label">Пояснение</label>
              <textarea
                type="text"
                class="form-control"
                v-model="currentServiceRequest.request_description"
                rows="4"
              />
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

          <div class="col-6">
            <div class="mb-3">
              <label class="form-label">Исполнитель</label>
              <select
                v-model="currentServiceRequest.executor"
                class="form-select"
              >
                <option
                  :value="user.id"
                  v-for="user in sortedUsersList"
                  :key="user.id"
                >
                  {{ user.username }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!--  {{ currentServiceRequest }}-->
  <!--  {{ chatMessages }}-->
</template>

<script>
import ReconnectingWebSocket from "reconnecting-websocket"
import { serviceRequestAPI } from "@/api/client/serviceRequestAPI"
import { messagesAPI } from "@/api/admin/messagesAPI"
import { mapGetters } from "vuex"
import { getFormattedDate, getFormattedTime } from "@/utils"
import { usersAPI } from "@/api/admin/usersAPI"
import { locationAPI } from "@/api/admin/locationAPI"
import { statusAPI } from "@/api/admin/statusAPI"

export default {
  name: "AdminServiceRequestItemView",
  components: {},
  data() {
    return {
      chatMessages: { results: [] },
      locationList: { results: [] },
      usersList: { results: [] },
      statusesList: { results: [] },
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
  },
}
</script>
