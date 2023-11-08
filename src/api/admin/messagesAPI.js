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
}
