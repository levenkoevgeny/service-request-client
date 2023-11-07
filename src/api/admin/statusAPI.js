import axios from "axios"
import { authHeaders } from "@/api/auth/authAPI"

let base_url = "statuses"

export const statusAPI = {
  async getItemsList(token) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/`,
      authHeaders(token),
    )
  },
}
