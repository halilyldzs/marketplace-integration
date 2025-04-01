import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useRef } from "react"

type BroadcastMessage = {
  type: "INVALIDATE_QUERIES" | "REFETCH_QUERIES" | "RESET_QUERIES"
  queryKey?: string[]
  exact?: boolean
}

export const useBroadcast = () => {
  const queryClient = useQueryClient()
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    channelRef.current = new BroadcastChannel("app_sync")

    const handleMessage = (event: MessageEvent<BroadcastMessage>) => {
      const { type, queryKey, exact } = event.data

      switch (type) {
        case "INVALIDATE_QUERIES":
          if (queryKey) {
            queryClient.invalidateQueries({ queryKey, exact })
          } else {
            queryClient.invalidateQueries()
          }
          break

        case "REFETCH_QUERIES":
          if (queryKey) {
            queryClient.refetchQueries({ queryKey, exact })
          } else {
            queryClient.refetchQueries()
          }
          break

        case "RESET_QUERIES":
          if (queryKey) {
            queryClient.resetQueries({ queryKey, exact })
          } else {
            queryClient.resetQueries()
          }
          break
      }
    }

    channelRef.current.addEventListener("message", handleMessage)

    return () => {
      if (channelRef.current) {
        channelRef.current.removeEventListener("message", handleMessage)
        channelRef.current.close()
        channelRef.current = null
      }
    }
  }, [queryClient])

  const invalidateQueries = useCallback(
    (queryKey?: string[], exact?: boolean) => {
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "INVALIDATE_QUERIES",
          queryKey,
          exact,
        })
      }
    },
    []
  )

  const refetchQueries = useCallback((queryKey?: string[], exact?: boolean) => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "REFETCH_QUERIES",
        queryKey,
        exact,
      })
    }
  }, [])

  const resetQueries = useCallback((queryKey?: string[], exact?: boolean) => {
    if (channelRef.current) {
      channelRef.current.postMessage({
        type: "RESET_QUERIES",
        queryKey,
        exact,
      })
    }
  }, [])

  return {
    invalidateQueries,
    refetchQueries,
    resetQueries,
  }
}
