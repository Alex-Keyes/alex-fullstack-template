import { Flex, Image, useBreakpointValue, Stack } from "@chakra-ui/react"
import { Link } from "@tanstack/react-router"

import { Button } from "@/components/ui/button"
import { ColorModeButton } from "@/components/ui/color-mode"
import Logo from "/assets/images/fastapi-logo.svg"

function Navbar() {
  const display = useBreakpointValue({ base: "none", md: "flex" })

  return (
    <Flex
      display={display}
      justify="space-between"
      position="sticky"
      color="white"
      align="center"
      bg="bg.muted"
      w="100%"
      top={0}
      p={4}
    >
      <Link to="/">
        <Image src={Logo} alt="Logo" maxW="3xs" p={2} />
      </Link>
      
      <Stack direction="row" gap={4} align="center">
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
    </Flex>
  )
}

export default Navbar
