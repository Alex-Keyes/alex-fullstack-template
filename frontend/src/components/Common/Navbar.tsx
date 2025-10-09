import { Flex, Image, Stack, IconButton, VStack } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"
import { useState } from "react"
import { LuMenu } from "react-icons/lu"

import { Button } from "@/components/ui/button"
import { ColorModeButton } from "@/components/ui/color-mode"
import {
  DrawerRoot,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerBackdrop,
} from "@/components/ui/drawer"
import Logo from "/assets/images/fastapi-logo.svg"

function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <>
      <Flex
        justify="space-between"
        position="sticky"
        color="white"
        align="center"
        bg="bg.muted"
        w="100%"
        top={0}
        p={4}
        zIndex={10}
      >
        <Link to="/">
          <Image src={Logo} alt="Logo" maxW="3xs" p={2} />
        </Link>
        
        {/* Desktop Navigation */}
        <Stack direction="row" gap={4} align="center" display={{ base: "none", md: "flex" }}>
          <ColorModeButton />
          <Link to="/login">
            <Button variant="outline">
              Login
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="solid">
              Sign Up
            </Button>
          </Link>
        </Stack>

        {/* Mobile Hamburger Menu */}
        <IconButton
          display={{ base: "flex", md: "none" }}
          aria-label="Open menu"
          onClick={() => setIsDrawerOpen(true)}
        >
          <LuMenu />
        </IconButton>
      </Flex>

      {/* Mobile Drawer */}
      <DrawerRoot
        open={isDrawerOpen}
        onOpenChange={(e) => setIsDrawerOpen(e.open)}
        placement="end"
      >
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerCloseTrigger />
          <DrawerBody>
            <VStack gap={4} align="stretch">
              <ColorModeButton />
              <Link to="/login" onClick={() => setIsDrawerOpen(false)}>
                <Button variant="outline" w="100%">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setIsDrawerOpen(false)}>
                <Button variant="solid" w="100%">
                  Sign Up
                </Button>
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </DrawerRoot>
    </>
  )
}

export default Navbar
