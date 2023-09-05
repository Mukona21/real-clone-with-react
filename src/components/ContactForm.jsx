import React, { useEffect, useState } from 'react'
import { doc, getDoc, db } from '../firebase'
import { toast } from 'react-toastify'
import styled from 'styled-components'

const Textarea = styled.textarea`
  width: 100%;
  border: solid 2px #c4c9c2;
  border-radius: 0.5rem;
  font-size: 1.2rem;
  padding: 1rem;
  margin: 1rem 0;

  &:focus {
    outline: solid 2px #1d4ed8;
    border: none;
  }
`
const Button = styled.button`
  width: 100%;
  padding: 1rem 0;
  border-radius: 0.25rem;
  border: none;
  background-color: #2563eb;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
`

const ContactForm = ({ userRef, listing }) => {
  const [landlord, setLandlord] = useState(null)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const getLandlord = async () => {
      const docRef = doc(db, 'users', userRef)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setLandlord(docSnap.data())
      } else {
        toast.error("Could not get Landlord's data")
      }
    }
    getLandlord()
  }, [userRef])

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <>
      {landlord !== null && (
        <div>
          <p>
            Contact {landlord.name} for the {listing.name.toLowerCase()}
          </p>
          <div>
            <Textarea
              name='message'
              rows='2'
              value={message}
              placeholder='Message'
              onChange={handleChange}
            ></Textarea>
          </div>
          <a
            href={`mailto:${landlord.email}?Subject=${listing.name}&body=${message}`}
          >
            <Button>Send message</Button>
          </a>
        </div>
      )}
    </>
  )
}

export default ContactForm
