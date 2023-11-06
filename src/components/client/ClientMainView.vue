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

  <div class="container">
    <div class="alert alert-danger" role="alert" v-if="isError">
      Ошибка приложения
    </div>
    <div class="d-flex align-items-center mb-3">
      <h5><font-awesome-icon icon="fa-solid fa-list" />&nbsp;&nbsp;</h5>
      <h3>Ваши заявки</h3>
    </div>
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

    <div
      v-if="isLoading"
      class="d-flex justify-content-center align-items-center"
      style="height: 80vh"
    >
      <Spinner />
    </div>
    <div v-else>
      <div
        class="card my-3"
        style="width: 100%"
        v-for="request in orderedServices"
        :key="request.id"
      >
        <div class="card-body">
          <h5 class="card-title">Заявка от {{ request.date_time_created }}</h5>
          <h5 class="card-title">Статус {{ request.get_request_status }}</h5>
          <p class="card-text">
            {{ request.request_description }}
          </p>
          <a href="#" class="btn btn-primary">Перейти к обсуждению</a>
        </div>
      </div>
      <nav>
        <ul class="pagination pagination-md">
          <li
            class="page-item"
            :class="{ disabled: !orderedServices.previous }"
          >
            <button
              class="page-link"
              @click="updatePaginator(orderedServices.previous)"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>
          <li class="mx-2"></li>
          <li class="page-item" :class="{ disabled: !orderedServices.next }">
            <button
              class="page-link"
              @click="updatePaginator(orderedServices.next)"
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
import { serviceRequestAPI } from "@/api/client/serviceRequestAPI"

export default {
  name: "ClientMainView",
  components: { Spinner },
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
    }
  },
  async created() {
    await this.loadData()
  },
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
  },
  computed: {
    ...mapGetters({
      userData: "auth/getUser",
      userToken: "auth/getToken",
    }),
    orderedLocations() {
      return this.locationList.results
    },
    orderedServices() {
      return this.serviceRequestList.results
    },
  },
  watch: {},
}
</script>

<style scoped></style>
