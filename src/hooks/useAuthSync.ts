import { useAuthStore } from "@store/auth"
import { useCallback, useEffect } from "react"

const CHANNEL_NAME = "auth_sync"

export const useAuthSync = () => {
  useEffect(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME)

    const handleMessage = (event: MessageEvent) => {
      const { type } = event.data

      if (type === "LOGOUT") {
        // Clear local storage
        localStorage.clear()
        // Reset auth store
        const logout = useAuthStore.getState().logout
        logout()
        // Redirect to login
        window.location.href = "/login"
      } else if (type === "LOGIN") {
        // Reload the page to get fresh state
        window.location.reload()
      }
    }

    channel.addEventListener("message", handleMessage)

    return () => {
      channel.removeEventListener("message", handleMessage)
      channel.close()
    }
  }, [])

  const notifyLogout = useCallback(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channel.postMessage({ type: "LOGOUT" })
    channel.close()
  }, [])

  const notifyLogin = useCallback(() => {
    const channel = new BroadcastChannel(CHANNEL_NAME)
    channel.postMessage({ type: "LOGIN" })
    channel.close()
  }, [])

  return {
    notifyLogin,
    notifyLogout,
  }
}
