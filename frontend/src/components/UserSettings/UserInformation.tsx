import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react"
import { useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"

import { useAuth } from "@/hooks/useAuth"
import { useCustomToast } from "@/hooks/useCustomToast"
import { emailPattern } from "@/utils"
import { Field } from "../ui/field"

const UserInformation = () => {
  const { showSuccessToast } = useCustomToast()
  const [editMode, setEditMode] = useState(false)
  const { user: currentUser, updateUser } = useAuth()
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isSubmitting, errors, isDirty },
  } = useForm({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      full_name: currentUser?.user_metadata?.full_name || "",
      email: currentUser?.email || "",
    },
  })

  const toggleEditMode = () => {
    setEditMode(!editMode)
  }

  const onSubmit: SubmitHandler<any> = async (data) => {
    const { error } = await updateUser({
      email: data.email,
      data: { full_name: data.full_name },
    })
    if (error) {
      // handle error
    } else {
      showSuccessToast({
        title: "User updated successfully.",
        description: data.email !== currentUser?.email ? "Please check your email to confirm the change." : undefined
      })
      setEditMode(false)
    }
  }

  const onCancel = () => {
    reset()
    toggleEditMode()
  }

  return (
    <Container maxW="full">
      <Heading size="sm" py={4}>
        User Information
      </Heading>
      <Box
        w={{ sm: "full", md: "sm" }}
        as="form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Field label="Full name">
          {editMode ? (
            <Input
              {...register("full_name", { maxLength: 30 })}
              type="text"
              size="md"
            />
          ) : (
            <Text
              fontSize="md"
              py={2}
              color={!currentUser?.user_metadata?.full_name ? "gray" : "inherit"}
              truncate
              maxW="sm"
            >
              {currentUser?.user_metadata?.full_name || "N/A"}
            </Text>
          )}
        </Field>
        <Field
          mt={4}
          label="Email"
          invalid={!!errors.email}
          errorText={errors.email?.message}
        >
          {editMode ? (
            <Input
              {...register("email", {
                required: "Email is required",
                pattern: emailPattern,
              })}
              type="email"
              size="md"
            />
          ) : (
            <Text fontSize="md" py={2} truncate maxW="sm">
              {currentUser?.email}
            </Text>
          )}
        </Field>
        <Flex mt={4} gap={3}>
          <Button
            variant="solid"
            onClick={editMode ? undefined : toggleEditMode}
            type={editMode ? "submit" : "button"}
            loading={isSubmitting}
            disabled={editMode ? !isDirty || !getValues("email") : false}
          >
            {editMode ? "Save" : "Edit"}
          </Button>
          {editMode && (
            <Button
              variant="subtle"
              colorPalette="gray"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          )}
        </Flex>
      </Box>
    </Container>
  )
}

export default UserInformation
