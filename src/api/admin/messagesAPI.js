import axios from "axios"
import { authHeaders } from "@/api/auth/authAPI"

let base_url = "messages"

export const messagesAPI = {
  async getItemsList(
    token,
    searchForm = {
      service_request: "",
      message_text: "",
      sender: "",
    },
  ) {
    let { service_request, message_text, sender } = searchForm
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/?service_request=${service_request}&sender=${sender}&message_text__icontains=${message_text}`,
      authHeaders(token),
    )
  },
  async getItemData(token, itemId) {
    return axios.get(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemId}`,
      authHeaders(token),
    )
  },

  async addItem(token, itemData) {
    return axios.post(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/`,
      itemData,
      authHeaders(token),
    )
  },

  async updateItem(token, itemData) {
    return axios.put(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemData.id}/`,
      itemData,
      authHeaders(token),
    )
  },

  async deleteItem(token, itemId) {
    return axios.delete(
      `${process.env.VUE_APP_BACKEND_PROTOCOL}://${process.env.VUE_APP_BACKEND_HOST}:${process.env.VUE_APP_BACKEND_PORT}/api/${base_url}/${itemId}/`,
      authHeaders(token),
    )
  },
}
