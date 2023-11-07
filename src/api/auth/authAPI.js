import axios from "axios"
import store from "@/store"
import index from "@/router"

export function authHeaders(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
}

axios.interceptors.response.use(
  function (response) {
    return response
  },
  async function (error) {
    if (error.response.status === 401 || error.response.status === 403) {
      store.dispatch("auth/actionRemoveLogIn")
      await index.replace({ name: "login" })
    }
    return Promise.reject(error)
  },
)

export const authApi = {
  async logInGetToken(username, password) {
    const params = new URLSearchParams()
    params.append("username", username)
    params.append("password", password)

    return axios.post(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/token/`,
      params,
    )
  },
  async registration(username, password) {
    const params = new URLSearchParams()
    params.append("username", username)
    params.append("password", password)
    return axios.post(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/users/user-registration/`,
      params,
    )
  },
  async getUserData(token) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/users/me/`,
      authHeaders(token),
    )
  },
  async getUserNames(username) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/usernames/?username=${username}`,
    )
  },
  async updateUserData(token, userData) {
    console.log(userData)
    let { last_name, first_name, phone_number } = userData

    return axios.patch(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/users/${userData.id}/`,
      { last_name, first_name, phone_number },
      authHeaders(token),
    )
  },
}
