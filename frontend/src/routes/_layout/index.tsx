import { 
  Box, 
  Container, 
  Text, 
  Stack, 
  Heading, 
  Button, 
  Flex, 
  Grid, 
  GridItem,
  Icon
} from "@chakra-ui/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { FaRocket, FaShieldAlt, FaCog, FaUsers, FaChartLine, FaLightbulb } from "react-icons/fa"

export const Route = createFileRoute("/_layout/")({
  component: LandingPage,
})

function LandingPage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        py={20}
        px={4}
      >
        <Container maxW="6xl" textAlign="center">
          <Stack direction="column" gap={8} align="center">
            <Heading size="4xl" fontWeight="bold">
              Build Amazing SaaS Apps
            </Heading>
            <Text fontSize="xl" maxW="2xl" opacity={0.9}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </Text>
            <Stack direction="row" gap={4}>
              <Link to="/login">
                <Button size="lg" colorScheme="white" variant="outline">
                  Get Started
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" colorScheme="white" variant="solid">
                  Sign Up
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxW="6xl" py={20}>
        <Stack direction="column" gap={16} align="center">
          <Box textAlign="center">
            <Heading size="2xl" mb={4}>
              Why Choose Our Platform?
            </Heading>
            <Text fontSize="lg" color="fg.muted" maxW="2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua.
            </Text>
          </Box>

          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={8}>
            <GridItem>
              <Stack direction="column" gap={4} p={6} bg="bg.panel" borderRadius="lg" boxShadow="md" align="start">
                <Icon as={FaRocket} boxSize={8} color="blue.500" />
                <Heading size="md">Fast Development</Heading>
                <Text color="fg.muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua.
                </Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack direction="column" gap={4} p={6} bg="bg.panel" borderRadius="lg" boxShadow="md" align="start">
                <Icon as={FaShieldAlt} boxSize={8} color="green.500" />
                <Heading size="md">Secure & Reliable</Heading>
                <Text color="fg.muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua.
                </Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack direction="column" gap={4} p={6} bg="bg.panel" borderRadius="lg" boxShadow="md" align="start">
                <Icon as={FaCog} boxSize={8} color="purple.500" />
                <Heading size="md">Easy Integration</Heading>
                <Text color="fg.muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua.
                </Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack direction="column" gap={4} p={6} bg="bg.panel" borderRadius="lg" boxShadow="md" align="start">
                <Icon as={FaUsers} boxSize={8} color="orange.500" />
                <Heading size="md">Team Collaboration</Heading>
                <Text color="fg.muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua.
                </Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack direction="column" gap={4} p={6} bg="bg.panel" borderRadius="lg" boxShadow="md" align="start">
                <Icon as={FaChartLine} boxSize={8} color="teal.500" />
                <Heading size="md">Analytics & Insights</Heading>
                <Text color="fg.muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua.
                </Text>
              </Stack>
            </GridItem>

            <GridItem>
              <Stack direction="column" gap={4} p={6} bg="bg.panel" borderRadius="lg" boxShadow="md" align="start">
                <Icon as={FaLightbulb} boxSize={8} color="yellow.500" />
                <Heading size="md">Innovation First</Heading>
                <Text color="fg.muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                  tempor incididunt ut labore et dolore magna aliqua.
                </Text>
              </Stack>
            </GridItem>
          </Grid>
        </Stack>
      </Container>

      {/* CTA Section */}
      <Box bg="bg.subtle" py={20}>
        <Container maxW="4xl" textAlign="center">
          <Stack direction="column" gap={8} align="center">
            <Heading size="2xl">
              Ready to Build Your Next SaaS?
            </Heading>
            <Text fontSize="lg" color="fg.muted" maxW="2xl">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </Text>
            <Stack direction="row" gap={4}>
              <Link to="/signup">
                <Button size="lg" colorScheme="blue">
                  Start Building Today
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* Footer */}
      <Box bg="bg.muted" py={8}>
        <Container maxW="6xl">
          <Flex justify="space-between" align="center" wrap="wrap">
            <Text color="fg.muted">
              © 2024 Your SaaS Platform. Lorem ipsum dolor sit amet.
            </Text>
            <Stack direction="row" gap={6}>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="ghost" size="sm">
                  Sign Up
                </Button>
              </Link>
            </Stack>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
