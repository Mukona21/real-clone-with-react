import React from 'react'
import styled from 'styled-components'
import { FcGoogle } from 'react-icons/fc'
import { toast } from 'react-toastify'
import { auth, db, getDoc, setDoc, serverTimestamp, doc } from '../firebase'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useLocation, useNavigate } from 'react-router-dom'

const Button = styled.button`
  width: 100%;
  background-color: red;
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
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    opacity: 1;
  }
`

const OAuth = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user exist in collection before adding to db
      const docRef = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      if (!docSnap.exists() || location.pathname === '/sign-in') {
        await setDoc(docRef, {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      } else {
        toast.error('User already exists! Sign in instead')
        return
      }

      toast.success(
        location.pathname === '/sign-in'
          ? 'Sign in successful!'
          : 'Sign up successful!',
      )
      navigate('/')
    } catch (error) {
      toast.error('Could not authorize with Google')
    }
  }

  return (
    <Button onClick={handleGoogleClick}>
      <FcGoogle
        style={{
          backgroundColor: '#fff',
          borderRadius: '50%',
          fontSize: '1.2rem',
          marginRight: '0.5rem',
        }}
      />{' '}
      Continue with Google
    </Button>
  )
}

export default OAuth
