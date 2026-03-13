import { Container, Image, Input, Text } from '@chakra-ui/react'
import {
  Link as RouterLink,
  createFileRoute,
} from '@tanstack/react-router'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { FiLock, FiMail } from 'react-icons/fi'

import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { InputGroup } from '@/components/ui/input-group'
import { PasswordInput } from '@/components/ui/password-input'
import { useAuth } from '@/hooks/useAuth'
import Logo from '/assets/images/fastapi-logo.svg'
import { emailPattern, passwordRules } from '../utils'
import { useState } from 'react'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  const { signIn } = useAuth()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: 'onBlur',
    criteriaMode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit: SubmitHandler<any> = async (data) => {
    if (isSubmitting) return
    setError(null)

    const { error } = await signIn(data.email, data.password)
    if (error) {
      setError(error.message)
    } else {
      window.location.href = '/'
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
      <Image
        src={Logo}
        alt='Logo'
        height='auto'
        maxW='2xs'
        alignSelf='center'
        mb={4}
      />
      <Field
        invalid={!!errors.email || !!error}
        errorText={errors.email?.message || error || ''}
      >
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
      <PasswordInput
        type='password'
        startElement={<FiLock />}
        {...register('password', passwordRules())}
        placeholder='Password'
        errors={errors}
      />
      <RouterLink to='/recover-password' style={{ color: 'teal', fontSize: 'sm' }}>
        Forgot Password?
      </RouterLink>
      <Button variant='solid' type='submit' loading={isSubmitting} size='md'>
        Log In
      </Button>
      <Text>
        Don't have an account?{' '}
        <RouterLink to='/signup' style={{ color: 'teal', fontSize: 'sm' }}>
          Sign Up
        </RouterLink>
      </Text>
    </Container>
  )
}
