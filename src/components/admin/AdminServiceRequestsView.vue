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
        <form @submit.prevent="addNewServiceRequest">
          <div class="modal-header">
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
                    <label class="form-label">От кого заявка</label>
                    <select
                      class="form-select"
                      v-model="newServiceRequest.request_sender"
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
                <div class="col-12">
                  <div class="mb-3">
                    <label class="form-label">Учебный корпус</label>
                    <select
                      class="form-select"
                      v-model="newServiceRequest.location"
                      required
                    >
                      <option value="">----</option>
                      <option
                        v-for="location in sortedLocationsList"
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
                      v-model="newServiceRequest.address"
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
                      v-model="newServiceRequest.request_description"
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
              Создать заявку
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div>
    <div class="d-flex align-items-center mb-3">
      <h5><font-awesome-icon icon="fa-solid fa-list" />&nbsp;&nbsp;</h5>
      <h3 class="my-3">Заявки</h3>
    </div>
    <div class="container">
      <div class="shadow p-3 mb-5 bg-body rounded">
        <h5 class="my-2 fs-4">Фильтр</h5>
        <div class="row">
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label">Отправитель</label>
              <select
                class="form-select"
                v-model="requestsSearchForm.request_sender"
              >
                <option value="">-----</option>
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
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label">Учебный корпус</label>
              <select class="form-select" v-model="requestsSearchForm.location">
                <option value="">-----</option>
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
        </div>
        <div class="row">
          <div class="col-6">
            <div class="mb-3">
              <label class="form-label">Статус заявки</label>
              <select
                class="form-select"
                v-model="requestsSearchForm.request_status"
              >
                <option value="">-----</option>
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
              <select class="form-select" v-model="requestsSearchForm.executor">
                <option value="">-----</option>
                <option
                  :value="user.id"
                  v-for="user in sortedExecutorList"
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

    <div class="d-flex justify-content-end">
      <button
        style="height: 40px; width: 200px"
        type="button"
        class="btn btn-danger ms-2"
        @click="deleteCheckedServicesRequestsHandler"
        :class="{ 'd-none': !selectedServiceRequestsCount }"
      >
        Удалить - {{ selectedServiceRequestsCount }}
      </button>
      <button
        style="height: 40px; width: 200px"
        type="button"
        class="btn btn-primary ms-2"
        data-bs-toggle="modal"
        data-bs-target="#newServiceRequestModal"
      >
        Добавить заявку
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
      <div v-if="sortedServiceRequestsList.length > 0">
        <p class="fs-5 fw-bold my-3">
          Записей - {{ sortedServiceRequestsList.length }}
        </p>
        <table class="table table-hover mt-4 bg-body align-middle">
          <thead class="table-primary">
            <tr>
              <th scope="col" class="text-center">
                <input
                  type="checkbox"
                  class="form-check-input"
                  @click="checkAllHandler($event)"
                />
              </th>
              <th scope="col" class="text-center">№ п.п.</th>
              <th scope="col" class="text-center">От кого заявка</th>
              <th scope="col" class="text-start">Описание</th>
              <th scope="col" class="text-center">Адрес</th>
              <th scope="col" class="text-center">Дата и время заявки</th>
              <th scope="col" class="text-center">Кому поручено</th>
              <th scope="col" class="text-center">Статус заявки</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(request, index) in sortedServiceRequestsList"
              :key="request.id"
              @click="navigateToRout(request.id)"
              style="cursor: pointer"
            >
              <td class="text-center" @click.stop>
                <input
                  type="checkbox"
                  class="form-check-input"
                  v-model="request.checked_val"
                />
              </td>
              <td class="text-center">{{ index + 1 }}</td>
              <td class="text-center">{{ request.get_sender_name }}</td>
              <td class="text-start">{{ request.request_description }}</td>
              <td class="text-center">
                <nobr>{{ request.address }}</nobr>
              </td>
              <td class="text-center">
                {{ getFormattedDateComponent(request.date_time_created) }}<br />
                {{ getFormattedTimeComponent(request.date_time_created) }}
              </td>
              <td class="text-center">{{ request.get_executor_name }}</td>
              <td class="text-center">
                <span
                  class="p-1"
                  :style="{ backgroundColor: request.get_request_status_color }"
                >
                  <nobr>{{ request.get_request_status_text }}</nobr>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <nav>
          <ul class="pagination pagination-md">
            <li
              class="page-item"
              :class="{ disabled: !serviceRequestsList.previous }"
            >
              <button
                class="page-link"
                @click="updatePaginator(serviceRequestsList.previous)"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li class="mx-2"></li>
            <li
              class="page-item"
              :class="{ disabled: !serviceRequestsList.next }"
            >
              <button
                class="page-link"
                @click="updatePaginator(serviceRequestsList.next)"
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      <div v-else class="mt-4">
        <h5>Записей не найдено</h5>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import debounce from "lodash.debounce"
import Spinner from "@/components/common/Spinner.vue"
import { locationAPI } from "@/api/admin/locationAPI"
import { usersAPI } from "@/api/admin/usersAPI"
import { serviceRequestAPI } from "@/api/admin/serviceRequestAPI"
import { statusAPI } from "@/api/admin/statusAPI"
import { getFormattedDate, getFormattedTime } from "@/utils"
export default {
  name: "AdminServiceRequestsView",
  data() {
    return {
      serviceRequestsList: { results: [] },
      locationList: { results: [] },
      usersList: { results: [] },
      executorList: { results: [] },
      statusesList: { results: [] },
      isLoading: true,
      isError: false,
      newServiceRequest: {
        request_sender: "",
        location: "",
        address: "",
        request_description: "",
      },
      currentServiceRequestForUpdate: {
        request_sender: "",
        address: "",
        location: "",
        request_status: "",
        request_description: "",
        executor: "",
      },
      requestsSearchForm: {
        request_sender: "",
        address: "",
        location: "",
        request_status: "",
        executor: "",
      },
    }
  },
  methods: {
    async loadData() {
      try {
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

        const responseRequests = await serviceRequestAPI.getItemsList(
          this.userToken,
          this.requestsSearchForm,
        )
        this.serviceRequestsList = await responseRequests.data

        const responseStatuses = await statusAPI.getItemsList(this.userToken)
        this.statusesList = await responseStatuses.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async addNewServiceRequest() {
      this.isLoading = true
      try {
        await serviceRequestAPI.addItem(this.userToken, this.newServiceRequest)
        await this.loadData()
      } catch (error) {
      } finally {
        this.$refs.addNewServiceRequestModalCloseButton.click()
        this.newServiceRequestForm = {
          request_sender: "",
          location: "",
          address: "",
          request_description: "",
        }
        this.isLoading = false
      }
    },
    async updateServiceRequest(userId) {},
    async deleteCheckedServicesRequestsHandler() {
      this.isLoading = true
      this.isError = false
      let requestIds = []
      this.serviceRequestsList.results.map((serReq) => {
        if (serReq.checked_val) {
          requestIds.push(serReq.id)
        }
        return
      })
      let requests = requestIds.map((id) =>
        serviceRequestAPI.deleteItem(this.userToken, id),
      )
      Promise.all(requests)
        .then(async () => {
          await this.loadData()
        })
        .catch(() => (this.isError = true))
        .finally(() => {
          this.isLoading = false
        })
    },
    async updatePaginator(url) {
      this.isLoading = true
      try {
        const responseUsers = await usersAPI.updateList(url, this.userToken)
        this.usersList = await responseUsers.data
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    debouncedSearch: debounce(async function () {
      await this.loadData()
    }, 100),
    navigateToRout(id) {
      this.$router.push({
        name: "admin-requests-item",
        params: { requestId: id },
      })
    },
    getFormattedDateComponent(dateTime) {
      return getFormattedDate(dateTime)
    },
    getFormattedTimeComponent(dateTime) {
      return getFormattedTime(dateTime)
    },
    checkAllHandler(e) {
      if (e.target.checked) {
        this.serviceRequestsList.results = this.serviceRequestsList.results.map(
          (serReq) => ({
            ...serReq,
            checked_val: true,
          }),
        )
      } else {
        this.serviceRequestsList.results = this.serviceRequestsList.results.map(
          (serReq) => ({
            ...serReq,
            checked_val: false,
          }),
        )
      }
    },
  },
  async created() {
    await this.loadData()
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    sortedServiceRequestsList() {
      return this.serviceRequestsList.results
    },
    sortedUsersList() {
      return this.usersList.results
    },
    sortedExecutorList() {
      return this.executorList.results
    },
    sortedLocationsList() {
      return this.locationList.results
    },
    sortedStatusesList() {
      return this.statusesList.results
    },
    selectedServiceRequestsCount() {
      let counter = 0
      this.serviceRequestsList.results.map((serReq) => {
        if (serReq.checked_val) {
          counter++
        }
      })
      return counter
    },
  },
  watch: {
    requestsSearchForm: {
      handler(newValue, oldValue) {
        this.debouncedSearch()
      },
      deep: true,
    },
  },
}
</script>

<style scoped></style>
