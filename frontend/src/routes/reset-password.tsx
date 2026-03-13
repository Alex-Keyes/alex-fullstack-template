import { Container, Heading, Text } from '@chakra-ui/react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { FiLock } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { PasswordInput } from '@/components/ui/password-input'
import { useAuth } from '@/hooks/useAuth'
import { useCustomToast } from '@/hooks/useCustomToast'
import { confirmPasswordRules, passwordRules } from '@/utils'
import { useState } from 'react'

export const Route = createFileRoute('/reset-password')({
  component: ResetPassword,
})

function ResetPassword() {
  const { updatePassword } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    getValues,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      new_password: '',
      confirm_password: '',
    },
  })
  const { showSuccessToast } = useCustomToast()
  const navigate = useNavigate()

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (isSubmitting) return
    setError(null)

    const { error } = await updatePassword(data.new_password)
    if (error) {
      setError(error.message)
    } else {
      showSuccessToast({
        title: 'Password updated successfully.',
      })
      reset()
      navigate({ to: '/login' })
    }
  }

  return (
    <Container
      as='form'
      onSubmit={handleSubmit(onSubmit)}
      h='100vh'
      maxW='sm'
      alignItems='stretch'
      justifyContent='center'
      gap={4}
      centerContent
    >
      <Heading size='xl' color='ui.main' textAlign='center' mb={2}>
        Reset Password
      </Heading>
      <Text textAlign='center'>
        Please enter your new password and confirm it to reset your password.
      </Text>
      <PasswordInput
        startElement={<FiLock />}
        type='new_password'
        errors={errors}
        {...register('new_password', passwordRules())}
        placeholder='New Password'
      />
      <PasswordInput
        startElement={<FiLock />}
        type='confirm_password'
        errors={errors}
        {...register('confirm_password', confirmPasswordRules(getValues))}
        placeholder='Confirm Password'
      />
      <Button variant='solid' type='submit' loading={isSubmitting}>
        Reset Password
      </Button>
      {error && (
        <Text color='red.500' fontSize='sm' textAlign='center'>
          {error}
        </Text>
      )}
    </Container>
  )
}
