import { Flex, Skeleton } from "@chakra-ui/react"
import { Outlet, createFileRoute, redirect, useRouterState } from "@tanstack/react-router"

import Navbar from "@/components/Common/Navbar"
import { useAuth } from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout")({
  component: Layout,
})

function Layout() {
  const { user, loading } = useAuth()
  const routerState = useRouterState()

  if (loading) {
    return (
      <Flex direction="column" h="100vh">
        <Navbar />
        <Flex flex="1" direction="column" p={4}>
          <Skeleton h="60px" mb={4} />
          <Skeleton flex="1" />
        </Flex>
      </Flex>
    )
  }

  const isPublicPath = routerState.location.pathname === "/"

  if (!user && !isPublicPath) {
    throw redirect({
      to: "/login",
    })
  }

  return (
    <Flex direction="column" h="100vh">
      <Navbar />
      <Flex flex="1" direction="column" p={4} overflowY="auto">
        <Outlet />
      </Flex>
    </Flex>
  )
}

export default Layout
