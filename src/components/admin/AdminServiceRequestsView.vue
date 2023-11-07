<template>
  <div class="container">
    <div class="d-flex align-items-center mb-3">
      <h5><font-awesome-icon icon="fa-solid fa-list" />&nbsp;&nbsp;</h5>
      <h3>Заявки</h3>
    </div>
    <div>
      <button
        style="height: 40px; width: 200px"
        type="button"
        class="btn btn-primary ms-2"
        data-bs-toggle="modal"
        data-bs-target="#newServiceRequestModal"
      >
        <!--      <font-awesome-icon icon="fa-solid fa-plus" />-->
        Добавить
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
      <table class="table">
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">От кого заявка</th>
            <th scope="col">Описание</th>
            <th scope="col">Адрес</th>
            <th scope="col">Дата и время заявки</th>
            <th scope="col">Кому поручено</th>
            <th scope="col">Статус заявки</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in sortedServiceRequestsList" :key="request.id">
            <td></td>
            <td>{{ request.request_sender }}</td>
            <td>{{ request.request_description }}</td>
            <td>{{ request.address }}</td>
            <td>{{ request.date_time_created }}</td>
            <td>{{ request.executor }}</td>
            <td>{{ request.request_status }}</td>
          </tr>
        </tbody>
      </table>
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
export default {
  name: "AdminServiceRequestsView",
  data() {
    return {
      serviceRequestsList: { results: [] },
      locationList: { results: [] },
      usersList: { results: [] },
      isLoading: true,
      isError: false,
      newServiceRequest: { location: "", address: "", request_description: "" },
      currentServiceRequestForUpdate: null,
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
        console.log(this.usersList)
        console.log(this.locationList)
        console.log(this.serviceRequestsList)
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
    selectedServiceRequestsCount() {},
  },
  watch: {},
}
</script>

<style scoped></style>
