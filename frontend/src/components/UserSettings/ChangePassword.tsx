import { Box, Button, Container, Heading, VStack } from "@chakra-ui/react"
import { type SubmitHandler, useForm } from "react-hook-form"
import { FiLock } from "react-icons/fi"

import { useAuth } from "@/hooks/useAuth"
import { useCustomToast } from "@/hooks/useCustomToast"
import { confirmPasswordRules, passwordRules } from "@/utils"
import { PasswordInput } from "../ui/password-input"
import { useState } from "react"

const ChangePassword = () => {
  const { updatePassword } = useAuth()
  const { showSuccessToast } = useCustomToast()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      new_password: "",
      confirm_password: "",
    },
  })

  const onSubmit: SubmitHandler<any> = async (data) => {
    setError(null)
    const { error } = await updatePassword(data.new_password)
    if (error) {
      setError(error.message)
    } else {
      showSuccessToast({
        title: "Password updated successfully.",
      })
      reset()
    }
  }

  return (
    <Container maxW="full">
      <Heading size="sm" py={4}>
        Change Password
      </Heading>
      <Box as="form" onSubmit={handleSubmit(onSubmit)}>
        <VStack gap={4} w={{ base: "100%", md: "sm" }}>
          <PasswordInput
            type="new_password"
            startElement={<FiLock />}
            {...register("new_password", passwordRules())}
            placeholder="New Password"
            errors={errors}
          />
          <PasswordInput
            type="confirm_password"
            startElement={<FiLock />}
            {...register("confirm_password", confirmPasswordRules(getValues))}
            placeholder="Confirm Password"
            errors={errors}
          />
        </VStack>
        <Button
          variant="solid"
          mt={4}
          type="submit"
          loading={isSubmitting}
          disabled={!isValid}
        >
          Save
        </Button>
        {error && (
          <Box mt={2} color="red.500" fontSize="sm">
            {error}
          </Box>
        )}
      </Box>
    </Container>
  )
}
export default ChangePassword
