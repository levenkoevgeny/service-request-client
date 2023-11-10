<template>
  <!--  <div-->
  <!--    class="modal fade"-->
  <!--    id="updateServiceRequestModal"-->
  <!--    tabindex="-1"-->
  <!--    aria-labelledby="exampleModalLabel2"-->
  <!--    aria-hidden="true"-->
  <!--    ref="serviceRequestUpdateModal"-->
  <!--  >-->
  <!--    <div class="modal-dialog modal-dialog-centered modal-lg">-->
  <!--      <div class="modal-content">-->
  <!--        <form @submit.prevent="updateServiceRequestHandler">-->
  <!--          <div class="modal-header">-->
  <!--            <h5 class="modal-title" id="exampleModalLabel">-->
  <!--              Редактирование заявки-->
  <!--            </h5>-->
  <!--            <button-->
  <!--              type="button"-->
  <!--              class="btn-close"-->
  <!--              data-bs-dismiss="modal"-->
  <!--              aria-label="Close"-->
  <!--            ></button>-->
  <!--          </div>-->
  <!--          <div class="modal-body">-->
  <!--            <div class="container-fluid">-->
  <!--              <div class="row">-->
  <!--                <div class="col-12">-->
  <!--                  <div class="mb-3">-->
  <!--                    <label class="form-label">Отправитель</label>-->
  <!--                    <select-->
  <!--                      v-model="currentServiceRequestForUpdate.request_sender"-->
  <!--                      class="form-select"-->
  <!--                      required-->
  <!--                    >-->
  <!--                      <option-->
  <!--                        :value="user.id"-->
  <!--                        v-for="user in sortedUsersList"-->
  <!--                        :key="user.id"-->
  <!--                      >-->
  <!--                        {{ user.username }}-->
  <!--                      </option>-->
  <!--                    </select>-->
  <!--                  </div>-->
  <!--                </div>-->

  <!--                <div class="col-12">-->
  <!--                  <div class="mb-3">-->
  <!--                    <label class="form-label">Учебный корпус</label>-->
  <!--                    <select-->
  <!--                      v-model="currentServiceRequestForUpdate.location"-->
  <!--                      class="form-select"-->
  <!--                      required-->
  <!--                    >-->
  <!--                      <option-->
  <!--                        :value="location.id"-->
  <!--                        v-for="location in sortedLocationsList"-->
  <!--                        :key="location.id"-->
  <!--                      >-->
  <!--                        {{ location.location }}-->
  <!--                      </option>-->
  <!--                    </select>-->
  <!--                  </div>-->
  <!--                </div>-->
  <!--                <div class="col-12">-->
  <!--                  <div class="mb-3">-->
  <!--                    <label class="form-label">Адрес</label>-->
  <!--                    <input-->
  <!--                      type="text"-->
  <!--                      class="form-control"-->
  <!--                      v-model="currentServiceRequestForUpdate.address"-->
  <!--                      required-->
  <!--                    />-->
  <!--                  </div>-->
  <!--                </div>-->

  <!--                <div class="col-12">-->
  <!--                  <div class="mb-3">-->
  <!--                    <label class="form-label">Пояснение</label>-->
  <!--                    <textarea-->
  <!--                      type="text"-->
  <!--                      class="form-control"-->
  <!--                      v-model="-->
  <!--                        currentServiceRequestForUpdate.request_description-->
  <!--                      "-->
  <!--                      rows="4"-->
  <!--                    />-->
  <!--                  </div>-->
  <!--                </div>-->

  <!--                <div class="col-12">-->
  <!--                  <div class="mb-3">-->
  <!--                    <label class="form-label">Статус</label>-->
  <!--                    <select-->
  <!--                      v-model="currentServiceRequestForUpdate.request_status"-->
  <!--                      class="form-select"-->
  <!--                      required-->
  <!--                    >-->
  <!--                      <option-->
  <!--                        :value="status.id"-->
  <!--                        v-for="status in sortedStatusesList"-->
  <!--                        :key="status.id"-->
  <!--                      >-->
  <!--                        {{ status.status }}-->
  <!--                      </option>-->
  <!--                    </select>-->
  <!--                  </div>-->
  <!--                </div>-->

  <!--                <div class="col-12">-->
  <!--                  <div class="mb-3">-->
  <!--                    <label class="form-label">Исполнитель</label>-->
  <!--                    <select-->
  <!--                      v-model="currentServiceRequestForUpdate.executor"-->
  <!--                      class="form-select"-->
  <!--                    >-->
  <!--                      <option-->
  <!--                        :value="user.id"-->
  <!--                        v-for="user in sortedUsersList"-->
  <!--                        :key="user.id"-->
  <!--                      >-->
  <!--                        {{ user.username }}-->
  <!--                      </option>-->
  <!--                    </select>-->
  <!--                  </div>-->
  <!--                </div>-->
  <!--              </div>-->
  <!--            </div>-->
  <!--          </div>-->
  <!--          <div class="modal-footer">-->
  <!--            <button-->
  <!--              type="button"-->
  <!--              class="btn btn-secondary"-->
  <!--              data-bs-dismiss="modal"-->
  <!--              ref="updateServiceRequestCloseButton"-->
  <!--            >-->
  <!--              Закрыть-->
  <!--            </button>-->
  <!--            <button type="submit" class="btn btn-primary">Сохранить</button>-->
  <!--          </div>-->
  <!--        </form>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--  </div>-->

  <div class="container">
    <div class="d-flex align-items-center mb-3">
      <h5><font-awesome-icon icon="fa-solid fa-list" />&nbsp;&nbsp;</h5>
      <h3>Заявки</h3>
    </div>
    <div>
      <!--      <button-->
      <!--        style="height: 40px; width: 200px"-->
      <!--        type="button"-->
      <!--        class="btn btn-primary ms-2"-->
      <!--        data-bs-toggle="modal"-->
      <!--        data-bs-target="#newServiceRequestModal"-->
      <!--        disabled-->
      <!--      >-->
      <!--        &lt;!&ndash;      <font-awesome-icon icon="fa-solid fa-plus" />&ndash;&gt;-->
      <!--        Добавить-->
      <!--      </button>-->
    </div>
    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center"
      style="height: 80vh"
    >
      <Spinner />
    </div>

    <div v-else>
      <table class="table table-hover table-sm mt-4">
        <thead class="table-primary">
          <tr>
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
            <td class="text-center">{{ index + 1 }}</td>
            <td class="text-center">{{ request.get_sender_name }}</td>
            <td class="text-start">{{ request.request_description }}</td>
            <td class="text-center">{{ request.address }}</td>
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
                {{ request.get_request_status_text }}
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
      statusesList: { results: [] },
      isLoading: true,
      isError: false,
      newServiceRequest: { location: "", address: "", request_description: "" },
      currentServiceRequestForUpdate: {
        request_sender: null,
        address: "",
        location: null,
        request_status: "",
        request_description: "",
        executor: null,
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
    async addNewServiceRequest() {},
    async updateServiceRequest(userId) {},
    async deleteSelectedServiceRequests() {},
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
    async showModalForUpdateServiceRequest(requestId) {
      this.isError = false
      try {
        const response = await serviceRequestAPI.getItemData(
          this.userToken,
          requestId,
        )
        this.currentServiceRequestForUpdate = await response.data

        let updateModal = this.$refs.serviceRequestUpdateModal
        let myModal = new bootstrap.Modal(updateModal, { keyboard: false })
        myModal.show()
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
    async updateServiceRequestHandler() {
      try {
        await serviceRequestAPI.updateItem(
          this.userToken,
          this.currentServiceRequestForUpdate,
        )
        await this.loadData()
        this.$refs.updateServiceRequestCloseButton.click()
      } catch (error) {
        this.isError = true
      } finally {
        this.isLoading = false
      }
    },
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
    sortedLocationsList() {
      return this.locationList.results
    },
    sortedStatusesList() {
      return this.statusesList.results
    },
    selectedServiceRequestsCount() {},
  },
  watch: {},
}
</script>

<style scoped></style>
