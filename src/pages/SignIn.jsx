import React, { useState } from 'react'
import styled from 'styled-components'
import { medium, small } from '../responsive'
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { Link, Navigate } from 'react-router-dom'
import OAuth from '../components/OAuth'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Section = styled.section``

const PageWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  padding: 3rem 1.5rem;
  max-width: 72rem;
  margin: 0 auto;

  ${medium({
    padding: '1rem',
  })};
`

const ImageWrapper = styled.div`
  width: 50%;
  margin-bottom: 3rem;

  ${small({
    marginBottom: '1.5rem',
  })};

  ${medium({
    width: '90%',
    marginBottom: '3rem',
  })};
`

const Image = styled.img`
  width: 100%;
  border-radius: 0.5rem;
`

const FormWrapper = styled.div`
  width: 40%;
  margin-left: 5rem;

  ${medium({
    width: '90%',
    marginLeft: 0,
  })};
`

const Form = styled.form``

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  border-radius: 0.25rem;
  border: solid 1px rgb(209, 213, 219);
  color: rgb(55, 65, 81);
  background-color: #fff;
  transition: 0.25s ease-in-out;
  margin-bottom: 1.5rem;

  &:focus {
    outline: solid 2px #3b8edb;
    border: none;
  }
`
const PasswordWrapper = styled.div`
  position: relative;
`
const PasswordIcon = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  font-size: 1.5rem;
  color: rgb(55, 65, 81);
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem 0.5rem 0;
`
const ForgotPasswordWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  align-items: center;
  padding: 0.5rem 0;
  margin-bottom: 1.5rem;

  ${small({
    fontSize: '0.875rem',
  })}

  ${medium({
    fontSize: '1.25rem',
  })}
`
const TextSmall = styled.small`
  color: rgb(55, 65, 81);
  padding: 0 0.2rem;
`
const Text = styled.div`
  text-align: center;
  font-weight: 600;
  margin: 1rem 0;
`

const Button = styled.button`
  width: 100%;
  background-color: #3b8ddd;
  color: #fff;
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  text-transform: uppercase;
  border-radius: 0.25rem;
  border: none;
  opacity: 0.8;
  transition: all 0.5s ease-in-out;

  &:hover {
    opacity: 1;
  }
`
const HorizontalLine = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeaderText = styled.h1`
  font-size: 1.87rem;
  line-height: 2.25rem;
  text-align: center;
  margin-top: 1.5rem;
  font-weight: 700;
`

const SignIn = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const { email, password } = formData

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }))
  }

  const toggleShowPassword = () => {
    setShowPassword((prevState) => !prevState)
  }

  const handleSubmit = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      )

      if (userCredential.user) {
        toast.success('Sign in successful, redirecting...')
        navigate('/')
      } else {
        toast.error('User not found, please sign up')
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <Section>
      <HeaderText>Sign In</HeaderText>
      <PageWrapper>
        <ImageWrapper>
          <Image
            src='https://images.pexels.com/photos/1011848/pexels-photo-1011848.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
            alt='key'
          />
        </ImageWrapper>
        <FormWrapper>
          <Form>
            <Input
              type='email'
              name='email'
              value={email}
              onChange={handleChange}
              placeholder='Email address'
            />
            <PasswordWrapper>
              <PasswordIcon>
                {showPassword ? (
                  <AiFillEyeInvisible onClick={toggleShowPassword} />
                ) : (
                  <AiFillEye onClick={toggleShowPassword} />
                )}
              </PasswordIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                name='password'
                value={password}
                onChange={handleChange}
                placeholder='Password'
              />
            </PasswordWrapper>

            <ForgotPasswordWrapper>
              <TextSmall>
                Don't have an account?{' '}
                <Link
                  to='/sign-up'
                  style={{
                    color: 'red',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  Register
                </Link>
              </TextSmall>
              <TextSmall>
                <Link
                  to='/forgot-password'
                  style={{
                    color: '#3B8DDD',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  Forgot password
                </Link>
              </TextSmall>
            </ForgotPasswordWrapper>
          </Form>
          <Button type='submit' onClick={handleSubmit}>
            Sign in
          </Button>
          <HorizontalLine>
            <hr style={{ width: '45%' }} />
            <Text> OR </Text>
            <hr style={{ width: '45%' }} />
          </HorizontalLine>

          <OAuth />
        </FormWrapper>
      </PageWrapper>
    </Section>
  )
}

export default SignIn
