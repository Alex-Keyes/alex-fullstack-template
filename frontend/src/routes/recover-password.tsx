import { Container, Heading, Input, Text } from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { FiMail } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { InputGroup } from '@/components/ui/input-group'
import { useAuth } from '@/hooks/useAuth'
import { useCustomToast } from '@/hooks/useCustomToast'
import { emailPattern } from '@/utils'
import { useState } from 'react'

export const Route = createFileRoute('/recover-password')({
  component: RecoverPassword,
})

function RecoverPassword() {
  const { resetPassword } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
    },
  })
  const { showSuccessToast } = useCustomToast()

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (isSubmitting) return
    setError(null)

    const { error } = await resetPassword(data.email)
    if (error) {
      setError(error.message)
    } else {
      showSuccessToast({
        title: 'Password recovery email sent',
        description: 'Please check your email for the recovery link.',
      })
      reset()
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
        Password Recovery
      </Heading>
      <Text textAlign='center'>
        A password recovery email will be sent to the registered account.
      </Text>
      <Field invalid={!!errors.email || !!error} errorText={errors.email?.message || error || ''}>
        <InputGroup w='100%' startElement={<FiMail />}>
          <Input
            id='email'
            {...register('email', {
              required: 'Email is required',
              pattern: emailPattern,
            })}
            placeholder='Email'
            type='email'
          />
        </InputGroup>
      </Field>
      <Button variant='solid' type='submit' loading={isSubmitting}>
        Continue
      </Button>
    </Container>
  )
}
