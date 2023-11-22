<template>
  <div
    class="modal fade"
    id="newServiceRequestModal"
    tabindex="-1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <form @submit.prevent="createNewServiceRequest">
          <div class="modal-header border-bottom border-3">
            <h5 class="modal-title" id="exampleModalLabel">Новая заявка</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="container-fluid">
              <div class="row">
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Учебный корпус</label>
                    <select
                      class="form-select"
                      v-model="newServiceRequestForm.location"
                      required
                    >
                      <option value="">----</option>
                      <option
                        v-for="location in orderedLocations"
                        :key="location.id"
                        :value="location.id"
                      >
                        {{ location.location }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label"
                      >Месторасположение (кабинет)</label
                    >
                    <input
                      class="form-control"
                      type="text"
                      v-model="newServiceRequestForm.address"
                      required
                    />
                  </div>
                </div>
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label"
                      >Описание заявки (неисправность)</label
                    >
                    <textarea
                      class="form-control"
                      type="text"
                      v-model="newServiceRequestForm.request_description"
                      rows="4"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              ref="addNewServiceRequestModalCloseButton"
            >
              Закрыть
            </button>
            <button type="submit" class="btn btn-primary">
              Отправить заявку
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <TopNavView />

  <button
    type="button"
    class="btn btn-link nav-link"
    data-bs-toggle="modal"
    data-bs-target="#personalDataModal"
    ref="updateProfileModalShowButtonHidden"
    style="display: none"
  >
    Профиль пользователя
  </button>
  <div class="container">
    <div class="d-flex align-items-center my-3">
      <h3>Ваши заявки</h3>
    </div>
    <div class="d-flex justify-content-start ms-0 ps-0">
      <button
        type="button"
        class="btn btn-primary my-add-button"
        data-bs-toggle="modal"
        data-bs-target="#newServiceRequestModal"
      >
        <font-awesome-icon icon="fa-solid fa-circle-plus" />&nbsp;&nbsp;Создать
        заявку в ООИТ
      </button>
    </div>

    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center"
      style="height: 80vh"
    >
      <Spinner />
    </div>

    <div v-else>
      <div v-if="isError" class="alert alert-danger m-0 p-3" role="alert">
        Ошибка приложения
      </div>
      <div class="my-3"></div>
      <div v-if="!orderedServices.length" class="my-5">
        <h3>У Вас еще пока нет сделанных заявок</h3>
      </div>

      <div v-else class="">
        <div
          v-for="request in orderedServices"
          :key="request.id"
          :style="{
            borderLeftColor: request.get_request_status_color,
          }"
          class="me-3 mb-3 d-inline-flex serviceCard"
          @click="navigateToRout(request.id)"
        >
          <div class="p-4" style="width: 100%">
            <h5>
              <font-awesome-icon icon="fa-solid fa-calendar-days" />&nbsp;&nbsp;
              {{ getFormattedDateComponent(request.date_time_created) }}
            </h5>
            <h5>
              <font-awesome-icon icon="fa-solid fa-clock" />&nbsp;&nbsp;
              {{ getFormattedTimeComponent(request.date_time_created) }}
            </h5>
            <p class="m-0 p-0 text-truncate">
              Текст заявки: {{ request.request_description }}
            </p>
            <p class="m-0 p-0 fw-bold">
              {{ request.get_request_status_text }}
            </p>
            <p></p>
            <p class="m-0 p-0" v-if="getUnreadMessagesCount(request.id) > 0">
              <font-awesome-icon icon="fa-solid fa-message" />&nbsp;&nbsp;Не
              прочитанных сообщений
              <span class="badge bg-secondary">{{
                getUnreadMessagesCount(request.id)
              }}</span>
            </p>
            <p class="m-0 p-0" v-else>
              <font-awesome-icon icon="fa-solid fa-message" />&nbsp;&nbsp;Новых
              сообщений нет
            </p>
          </div>
        </div>

        <div class="my-3"></div>
        <nav>
          <ul class="pagination pagination-md">
            <li
              class="page-item"
              :class="{ disabled: !serviceRequestList.previous }"

            >
              <button
                class="page-link"
                @click="updatePaginator(serviceRequestList.previous)"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li class="mx-2"></li>
            <li class="page-item" :class="{ disabled: !serviceRequestList.next }">
              <button
                class="page-link"
                @click="updatePaginator(serviceRequestList.next)"
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex"
import ReconnectingWebSocket from "reconnecting-websocket"
import debounce from "lodash.debounce"
import Spinner from "@/components/common/Spinner.vue"
import { locationAPI } from "@/api/admin/locationAPI"
import { serviceRequestAPI } from "@/api/client/serviceRequestAPI"
import TopNavView from "@/components/common/TopNavView.vue"
import { getFormattedDate, getFormattedTime } from "@/utils"
import { usersAPI } from "@/api/admin/usersAPI"
export default {
  name: "ClientMainView",
  components: { TopNavView, Spinner },
  data() {
    return {
      locationList: { results: [] },
      serviceRequestList: { results: [] },
      isLoading: true,
      isError: false,
      searchServiceRequestForm: {
        location: "",
      },
      newServiceRequestForm: {
        location: "",
        address: "",
        request_description: "",
      },
      unreadMessages: {},
      rws: null,
      rws_unread: null,
      BACKEND_PROTOCOL: process.env.VUE_APP_BACKEND_PROTOCOL,
      BACKEND_HOST: process.env.VUE_APP_BACKEND_HOST,
      BACKEND_PORT: process.env.VUE_APP_BACKEND_PORT,
    }
  },
  async created() {
    await this.loadData()
    this.rws = new ReconnectingWebSocket(
      `ws://${this.BACKEND_HOST}:${this.BACKEND_PORT}/ws/requests/${this.userData.id}/`,
    )

    this.rws_unread = new ReconnectingWebSocket(
      `ws://${this.BACKEND_HOST}:${this.BACKEND_PORT}/ws/unread/${this.userData.id}/`,
    )

    this.rws.addEventListener("open", () => {})
    this.rws_unread.addEventListener("open", () => {})

    this.rws.addEventListener("message", (e) => {
      const serviceRequestFromWebSocket = JSON.parse(e.data)
      let newServiceRequestList = this.serviceRequestList.results.map(
        (serReq) => {
          if (serReq.id === serviceRequestFromWebSocket.id) {
            return serviceRequestFromWebSocket
          } else {
            return serReq
          }
        },
      )
      this.serviceRequestList.results = newServiceRequestList
    })

    this.rws_unread.addEventListener("message", (e) => {
      const newUnreadData = JSON.parse(e.data)
      for (const [key, value] of Object.entries(newUnreadData)) {
        this.unreadMessages[key] = value
      }
    })
  },
  mounted() {
    if (!this.userData.phone_number || !this.userData.last_name) {
      this.$refs.updateProfileModalShowButtonHidden.click()
    }
  },
  async unmounted() {},
  methods: {
    async loadData() {
      try {
        const locationResponse = await locationAPI.getItemsList(this.userToken)
        this.locationList = await locationResponse.data

        const serviceResponse = await serviceRequestAPI.getItemsList(
          this.userToken,
          {
            ...this.searchServiceRequestForm,
            request_sender: this.userData.id,
          },
        )
        this.serviceRequestList = await serviceResponse.data

        const unreadResponse = await usersAPI.getUnreadMessagesCount(
          this.userToken,
          this.userData.id,
        )
        this.unreadMessages = await unreadResponse.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async createNewServiceRequest() {
      this.isLoading = true
      try {
        await serviceRequestAPI.addItem(this.userToken, {
          ...this.newServiceRequestForm,
          request_sender: this.userData.id,
        })
        await this.loadData()
      } catch (error) {
        this.isError = true
      } finally {
        this.$refs.addNewServiceRequestModalCloseButton.click()
        this.newServiceRequestForm = {
          location: "",
          address: "",
          request_description: "",
        }
        this.isLoading = false
      }
    },
    async updateServiceRequest(requestId) {},
    async updatePaginator(url) {
      this.isLoading = true
      try {
        const response = await serviceRequestAPI.updateList(url, this.userToken)
        this.serviceRequestList = await response.data
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
    navigateToRout(id) {
      this.$router.push({
        name: "service-request-view",
        params: { requestId: id },
      })
    },
    getUnreadMessagesCount(serviceRequestId) {
      return this.unreadMessages[serviceRequestId]
    },
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    ...mapState({
      currentUser: (state) => state.auth.user,
    }),
    orderedLocations() {
      return this.locationList.results
    },
    orderedServices() {
      return this.serviceRequestList.results.sort((a, b) => {
        return (
          this.getUnreadMessagesCount(b.id) - this.getUnreadMessagesCount(a.id)
        )
      })
    },
  },
  watch: {},
}
</script>

<style scoped>
.serviceCard {
  width: 25rem;
  height: 250px;
  transition: all 0.2s ease-in-out;
  border: 2px solid #dee2e6;
  border-radius: 0.6rem;
  border-left-width: 7px;
  background-color: #ffffff;
}

.serviceCard:hover {
  transform: scale(1.04);
  background-color: #ffd43b;
  border: 2px solid #ffd43b;
}

.my-add-button {
  transition: all 0.2s ease-in-out;
}
.my-add-button:hover {
  transform: scale(1.04);
}
</style>
