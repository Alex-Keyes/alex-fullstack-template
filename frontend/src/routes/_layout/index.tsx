import {
  Box,
  Container,
  Text,
  Stack,
  Heading,
  Flex,
  Grid,
  GridItem,
  Icon,
  Badge,
  Separator,
} from "@chakra-ui/react"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  FaRocket,
  FaShieldAlt,
  FaCog,
  FaUsers,
  FaChartLine,
  FaLightbulb,
  FaCheckCircle,
  FaTimesCircle,
  FaQuoteLeft,
  FaExclamationTriangle,
} from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

export const Route = createFileRoute("/_layout/")({
  component: LandingPage,
})

const SupabaseConfigAlert = () => {
  const { hasSupabaseConfig } = useAuth()
  
  if (hasSupabaseConfig) return null

  return (
    <Box bg="orange.100" color="orange.800" p={4} borderRadius="md" mb={8} border="1px solid" borderColor="orange.200">
      <Flex align="center" gap={3}>
        <Icon as={FaExclamationTriangle} />
        <Box>
          <Text fontWeight="bold">Supabase Not Configured</Text>
          <Text fontSize="sm">
            Please set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in your <code>frontend/.env</code> file to enable authentication features.
          </Text>
        </Box>
      </Flex>
    </Box>
  )
}

const testimonials = [
  {
    quote: "This template cut our time-to-launch in half. We shipped in two weeks instead of two months.",
    name: "Sarah K.",
    role: "Founder, Launchpad SaaS",
  },
  {
    quote: "Finally a frontend template that doesn't make me feel like I'm fighting the backend.",
    name: "Marcus T.",
    role: "CTO, DevFlow",
  },
  {
    quote: "Auth and frontend all wired up out of the box. It's like hiring an extra engineer.",
    name: "Priya N.",
    role: "Lead Developer, Workstream",
  },
]

const features = [
  {
    icon: FaRocket,
    color: "blue.500",
    title: "Ship in Days, Not Months",
    description:
      "Pre-built auth and user management mean you start with the hard parts already done.",
  },
  {
    icon: FaShieldAlt,
    color: "green.500",
    title: "Production-Ready Security",
    description:
      "Supabase Auth and role-based access control baked in from day one — no bolting it on later.",
  },
  {
    icon: FaCog,
    color: "purple.500",
    title: "Fully Typed Frontend",
    description:
      "TypeScript throughout the entire project keeps your code clean and maintainable.",
  },
  {
    icon: FaUsers,
    color: "orange.500",
    title: "User Management",
    description:
      "User settings and profile management built in. Manage your users without building the tooling.",
  },
  {
    icon: FaChartLine,
    color: "teal.500",
    title: "Scalable Architecture",
    description:
      "React + Supabase stack trusted at scale. Frontend-only architecture for easy deployment anywhere.",
  },
  {
    icon: FaLightbulb,
    color: "yellow.500",
    title: "Developer Experience First",
    description:
      "Hot reload, linting, formatting, and dev tooling configured so you can focus on your product.",
  },
]

const pricingPlans = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    description: "Everything you need to get started.",
    features: [
      "Full source code access",
      "Auth & user management",
      "React + Supabase stack",
      "Community support",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$49",
    period: "one-time",
    description: "For teams that want more out of the box.",
    features: [
      "Everything in Starter",
      "Priority email support",
      "Stripe billing integration",
      "Advanced role permissions",
      "Extended component library",
    ],
    cta: "Get Pro Access",
    highlighted: true,
  },
  {
    name: "Team",
    price: "$99",
    period: "one-time",
    description: "For teams shipping multiple products.",
    features: [
      "Everything in Pro",
      "Unlimited projects",
      "Team onboarding call",
      "Private Discord access",
      "Lifetime updates",
    ],
    cta: "Get Team Access",
    highlighted: false,
  },
]

const faqs = [
  {
    q: "Do I need to know Supabase or React to use this?",
    a: "Basic familiarity helps, but the template is designed to be readable and well-structured. Most developers are productive within an hour.",
  },
  {
    q: "Can I use this for commercial projects?",
    a: "Yes. Once you purchase, you can use the template in any number of commercial projects.",
  },
  {
    q: "Is there a refund policy?",
    a: "Yes — if you're not happy within 30 days, we'll refund you, no questions asked.",
  },
  {
    q: "How is this different from other boilerplates?",
    a: "Most boilerplates give you a skeleton. This one gives you a working product: auth flows and user settings — all connected to Supabase.",
  },
  {
    q: "Will I get updates when new features are added?",
    a: "Pro and Team licenses include lifetime updates. Starter gets major version releases.",
  },
  {
    q: "Is this a subscription?",
    a: "No. Pro and Team are one-time payments. No recurring fees.",
  },
  {
    q: "What database does this use?",
    a: "Supabase (PostgreSQL) by default. It's well-supported and battle-tested.",
  },
]

function LandingPage() {
  return (
    <Box>
      <SupabaseConfigAlert />
      {/* ── Hero ── */}
      <Box py={{ base: 20, md: 32 }} px={4} textAlign="center">
        <Container maxW="4xl">
          <Stack gap={6} align="center">
            <Badge colorScheme="teal" fontSize="sm" px={3} py={1} borderRadius="full">
              Frontend Template
            </Badge>
            <Heading size={{ base: "3xl", md: "5xl" }} fontWeight="extrabold" lineHeight="shorter">
              Launch Your SaaS in Days, Not Months
            </Heading>
            <Text fontSize={{ base: "lg", md: "xl" }} color="fg.muted" maxW="2xl">
              A production-ready template with auth, user management, and a
              polished UI — so you can ship your product instead of rebuilding the same foundation
              every time.
            </Text>

            {/* Product Visual Placeholder */}
            <Box
              w="100%"
              maxW="3xl"
              h={{ base: "200px", md: "380px" }}
              bg="bg.subtle"
              borderRadius="xl"
              border="1px solid"
              borderColor="border.subtle"
              display="flex"
              alignItems="center"
              justifyContent="center"
              overflow="hidden"
            >
              <Text color="fg.muted" fontSize="sm">
                [ Product demo / screenshot / GIF goes here ]
              </Text>
            </Box>

            <Link to="/signup">
              <Button size="xl" colorPalette="teal" px={10}>
                Start Building for Free
              </Button>
            </Link>

            {/* Social Proof Bar */}
            <Stack direction="row" gap={6} align="center" flexWrap="wrap" justify="center">
              <Flex align="center" gap={2}>
                <Icon as={FaCheckCircle} color="teal.500" />
                <Text fontSize="sm" color="fg.muted">500+ developers</Text>
              </Flex>
              <Flex align="center" gap={2}>
                <Icon as={FaCheckCircle} color="teal.500" />
                <Text fontSize="sm" color="fg.muted">"Best boilerplate I've used." — @devhunter</Text>
              </Flex>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Separator />

      {/* ── Problem Agitation ── */}
      <Box py={{ base: 16, md: 24 }} px={4}>
        <Container maxW="4xl" textAlign="center">
          <Stack gap={10} align="center">
            <Box>
              <Heading size="2xl" mb={4}>
                Building from scratch is killing your momentum
              </Heading>
              <Text fontSize="lg" color="fg.muted">
                Most developers start a new project the same way: cobble together auth, wire up a
                database, configure linting... before writing a single line
                of real product code.
              </Text>
            </Box>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              w="100%"
            >
              {[
                "Weeks wasted on boilerplate that isn't your product",
                "Security holes from DIY auth rolled under time pressure",
                "Frontend architecture that's hard to scale",
              ].map((pain) => (
                <GridItem key={pain}>
                  <Flex
                    gap={3}
                    p={5}
                    bg="bg.subtle"
                    borderRadius="lg"
                    align="start"
                    textAlign="left"
                  >
                    <Icon as={FaTimesCircle} color="red.400" mt={1} flexShrink={0} />
                    <Text color="fg.muted">{pain}</Text>
                  </Flex>
                </GridItem>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Separator />

      {/* ── Transformation ── */}
      <Box py={{ base: 16, md: 24 }} px={4} bg="bg.subtle">
        <Container maxW="5xl">
          <Stack gap={12} align="center">
            <Box textAlign="center">
              <Heading size="2xl" mb={4}>
                Here's what it looks like when the foundation is already done
              </Heading>
              <Text fontSize="lg" color="fg.muted" maxW="2xl">
                Open the template, update your branding, and start building features. That's it.
              </Text>
            </Box>

            {/* How It Works Visual Placeholder */}
            <Box
              w="100%"
              maxW="3xl"
              h={{ base: "180px", md: "320px" }}
              bg="bg.panel"
              borderRadius="xl"
              border="1px solid"
              borderColor="border.subtle"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text color="fg.muted" fontSize="sm">
                [ "How it works" diagram / walkthrough GIF goes here ]
              </Text>
            </Box>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              w="100%"
            >
              {[
                "Go from clone to running app in under 10 minutes",
                "Ship with confidence — auth and security handled by Supabase",
                "Focus purely on your product features",
              ].map((benefit) => (
                <GridItem key={benefit}>
                  <Flex
                    gap={3}
                    p={5}
                    bg="bg.panel"
                    borderRadius="lg"
                    align="start"
                    textAlign="left"
                  >
                    <Icon as={FaCheckCircle} color="teal.500" mt={1} flexShrink={0} />
                    <Text>{benefit}</Text>
                  </Flex>
                </GridItem>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Separator />

      {/* ── Social Proof / Testimonials ── */}
      <Box py={{ base: 16, md: 24 }} px={4}>
        <Container maxW="5xl">
          <Stack gap={10} align="center">
            <Heading size="2xl" textAlign="center">
              What developers are saying
            </Heading>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              w="100%"
            >
              {testimonials.map((t) => (
                <GridItem key={t.name}>
                  <Stack
                    gap={4}
                    p={6}
                    bg="bg.panel"
                    borderRadius="xl"
                    boxShadow="md"
                    h="100%"
                  >
                    <Icon as={FaQuoteLeft} color="teal.400" boxSize={5} />
                    <Text color="fg.muted" fontStyle="italic" flex={1}>
                      "{t.quote}"
                    </Text>
                    <Box>
                      <Text fontWeight="bold">{t.name}</Text>
                      <Text fontSize="sm" color="fg.muted">{t.role}</Text>
                    </Box>
                  </Stack>
                </GridItem>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Separator />

      {/* ── Features ── */}
      <Box py={{ base: 16, md: 24 }} px={4} bg="bg.subtle">
        <Container maxW="6xl">
          <Stack gap={12} align="center">
            <Box textAlign="center">
              <Heading size="2xl" mb={4}>
                Everything you need, nothing you don't
              </Heading>
              <Text fontSize="lg" color="fg.muted" maxW="2xl">
                Features that cover the full lifecycle of a production SaaS app.
              </Text>
            </Box>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
              gap={6}
              w="100%"
            >
              {features.map((f) => (
                <GridItem key={f.title}>
                  <Stack
                    gap={4}
                    p={6}
                    bg="bg.panel"
                    borderRadius="xl"
                    boxShadow="sm"
                    align="start"
                    h="100%"
                  >
                    <Icon as={f.icon} boxSize={7} color={f.color} />
                    <Heading size="md">{f.title}</Heading>
                    <Text color="fg.muted">{f.description}</Text>
                  </Stack>
                </GridItem>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Separator />

      {/* ── About Us ── */}
      <Box py={{ base: 16, md: 24 }} px={4}>
        <Container maxW="3xl" textAlign="center">
          <Stack gap={6} align="center">
            <Heading size="2xl">Why we built this</Heading>

            {/* Founder Photo Placeholder */}
            <Box
              w="80px"
              h="80px"
              borderRadius="full"
              bg="bg.subtle"
              border="2px solid"
              borderColor="border.subtle"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Text fontSize="xs" color="fg.muted">Photo</Text>
            </Box>

            <Text fontSize="lg" color="fg.muted">
              Every project I started began the same way — three days wiring up auth, another day
              configuring a backend. I was rebuilding the same foundation over and
              over while the actual product sat waiting.
            </Text>
            <Text fontSize="lg" color="fg.muted">
              I built this template to solve that for myself, and after using it to launch three
              products, I decided to share it. It's the foundation I wish I'd had on day one.
            </Text>
            <Text fontSize="lg" color="fg.muted">
              — Alex
            </Text>
          </Stack>
        </Container>
      </Box>

      <Separator />

      {/* ── Pricing ── */}
      <Box py={{ base: 16, md: 24 }} px={4} bg="bg.subtle">
        <Container maxW="5xl">
          <Stack gap={12} align="center">
            <Box textAlign="center">
              <Heading size="2xl" mb={2}>Simple, one-time pricing</Heading>
              <Text fontSize="lg" color="fg.muted">
                No subscriptions. Pay once, use forever. 30-day money-back guarantee.
              </Text>
            </Box>

            <Grid
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={6}
              w="100%"
              alignItems="start"
            >
              {pricingPlans.map((plan) => (
                <GridItem key={plan.name}>
                  <Stack
                    gap={5}
                    p={7}
                    bg={plan.highlighted ? "teal.500" : "bg.panel"}
                    color={plan.highlighted ? "white" : undefined}
                    borderRadius="xl"
                    boxShadow={plan.highlighted ? "xl" : "sm"}
                    border={plan.highlighted ? "none" : "1px solid"}
                    borderColor="border.subtle"
                    h="100%"
                  >
                    <Box>
                      <Text fontWeight="bold" fontSize="sm" opacity={plan.highlighted ? 0.8 : undefined} color={plan.highlighted ? undefined : "fg.muted"} mb={1}>
                        {plan.name}
                      </Text>
                      <Flex align="baseline" gap={1}>
                        <Heading size="3xl">{plan.price}</Heading>
                        <Text fontSize="sm" opacity={0.7}>/ {plan.period}</Text>
                      </Flex>
                      <Text fontSize="sm" mt={1} opacity={plan.highlighted ? 0.85 : undefined} color={plan.highlighted ? undefined : "fg.muted"}>
                        {plan.description}
                      </Text>
                    </Box>

                    <Stack gap={2} flex={1}>
                      {plan.features.map((feature) => (
                        <Flex key={feature} align="center" gap={2}>
                          <Icon
                            as={FaCheckCircle}
                            color={plan.highlighted ? "white" : "teal.500"}
                            flexShrink={0}
                          />
                          <Text fontSize="sm">{feature}</Text>
                        </Flex>
                      ))}
                    </Stack>

                    <Link to="/signup">
                      <Button
                        w="100%"
                        variant={plan.highlighted ? "outline" : "solid"}
                        colorPalette={plan.highlighted ? undefined : "teal"}
                        color={plan.highlighted ? "white" : undefined}
                        borderColor={plan.highlighted ? "white" : undefined}
                        _hover={plan.highlighted ? { bg: "whiteAlpha.200" } : undefined}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </Stack>
                </GridItem>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Separator />

      {/* ── FAQ ── */}
      <Box py={{ base: 16, md: 24 }} px={4}>
        <Container maxW="3xl">
          <Stack gap={10} align="center">
            <Heading size="2xl" textAlign="center">Frequently asked questions</Heading>
            <Stack gap={6} w="100%">
              {faqs.map((faq) => (
                <Box key={faq.q} p={6} bg="bg.subtle" borderRadius="xl">
                  <Text fontWeight="bold" mb={2}>{faq.q}</Text>
                  <Text color="fg.muted">{faq.a}</Text>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Separator />

      {/* ── Footer ── */}
      <Box py={8} px={4}>
        <Container maxW="6xl">
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Text color="fg.muted" fontSize="sm">
              © {new Date().getFullYear()} Alex Fullstack Template. Built with React + Supabase.
            </Text>
            <Stack direction="row" gap={4}>
              <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="ghost" size="sm">Sign Up</Button>
              </Link>
            </Stack>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}

export default LandingPage
