import { useQueryClient } from "@tanstack/react-query"
import { useCallback, useEffect, useMemo } from "react"

type BroadcastMessage = {
  type: "INVALIDATE_QUERIES" | "REFETCH_QUERIES" | "RESET_QUERIES"
  queryKey?: string[]
  exact?: boolean
}

export const useBroadcast = () => {
  const queryClient = useQueryClient()
  const channel = useMemo(() => new BroadcastChannel("app_sync"), [])

  useEffect(() => {
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

    channel.addEventListener("message", handleMessage)

    return () => {
      channel.removeEventListener("message", handleMessage)
      channel.close()
    }
  }, [queryClient, channel])

  const invalidateQueries = useCallback(
    (queryKey?: string[], exact?: boolean) => {
      channel.postMessage({
        type: "INVALIDATE_QUERIES",
        queryKey,
        exact,
      })
    },
    []
  )

  const refetchQueries = useCallback((queryKey?: string[], exact?: boolean) => {
    channel.postMessage({
      type: "REFETCH_QUERIES",
      queryKey,
      exact,
    })
  }, [])

  const resetQueries = useCallback((queryKey?: string[], exact?: boolean) => {
    channel.postMessage({
      type: "RESET_QUERIES",
      queryKey,
      exact,
    })
  }, [])

  return {
    invalidateQueries,
    refetchQueries,
    resetQueries,
  }
}
