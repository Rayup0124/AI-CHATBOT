import { onRequest as __chat_js_onRequest } from "C:\\Users\\User\\Documents\\GitHub\\BOTBUILDERS-CHATBOT\\functions\\chat.js"

export const routes = [
    {
      routePath: "/chat",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__chat_js_onRequest],
    },
  ]