import React, { useState } from 'react'
import styled from 'styled-components'
import { small, medium } from '../responsive'
import Spinner from '../components/Spinner'
import { toast } from 'react-toastify'
import {
  auth,
  serverTimestamp,
  db,
  addDoc,
  collection,
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from '../firebase'
import { v4 as uuidv4 } from 'uuid'
import { useNavigate } from 'react-router-dom'

const Main = styled.main`
  max-width: 35%;
  margin: 0 auto;
  /* border: solid 1px red; */

  ${medium({
    maxWidth: '80%',
    margin: '0 auto',
  })}

  ${small({
    maxWidth: '100%',
    margin: '0 auto',
  })}
`

const Title = styled.h1`
  font-size: 1.875rem;
  text-align: center;
  margin-top: 1.5rem;
  font-weight: 700;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
`

const Text = styled.p`
  margin-top: 1.5rem;
  font-weight: 600;
`
const BtnWrapper = styled.div`
  display: flex;
  margin-bottom: ${(props) => props.bottomMargin};
  width: 100%;
`

const Button = styled.button`
  flex: 1;
  padding: 1rem 2.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: small;
  text-transform: uppercase;
  border: none;
  border-radius: 0.25rem;
  background-color: ${(props) => props.bg};
  color: ${(props) => props.color};
  -webkit-box-shadow: 2px 2px 5px -3px rgba(55, 65, 81, 0.48);
  -moz-box-shadow: 2px 2px 5px -3px rgba(55, 65, 81, 0.48);
  box-shadow: 2px 2px 5px -3px rgba(55, 65, 81, 0.48);

  ${medium({
    width: '100%',
  })}
`
const PText = styled.p`
  margin-top: 1.5rem;
  font-weight: 600;
`
const Input = styled.input`
  padding: 1rem 0.5rem;
  color: rgb(55, 65, 81);
  font-size: 1.3rem;
  background-color: #fff;
  border: solid 1px rgb(209, 213, 219);
  border-radius: 0.25rem;
  margin-bottom: 1.5rem;

  &:focus {
    outline: none;
    color: rgb(55, 65, 81);
    opacity: 1;
    background-color: #fff;
    border: solid 1px rgb(209, 213, 219);
  }

  ${small({
    width: '100%',
  })}
`
const InputWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  margin-bottom: 1.5rem;
  gap: 2rem;
`

const SmallInputWrapper = styled.div`
  width: 30%;
`

const SmallInput = styled.input`
  padding: 1rem 0.25rem;
  color: rgb(55, 65, 81);
  border: solid 1px rgb(209, 213, 219);
  background-color: #fff;
  text-align: center;
  width: 100%;
  border-radius: 0.25rem;
  font-size: 1.3rem;

  ${medium({
    width: '100%',
  })};
`

const SmallInputText = styled.p`
  font-weight: 600;
`
const TextArea = styled.textarea`
  padding: 0.5rem 0.25rem;
  color: rgb(55, 65, 81);
  background-color: #fff;
  border: solid 1px rgb(209, 213, 219);
  border-radius: 0.25rem;
  width: 100%;
  font-size: 1.3rem;
`
const ImageUploadWrapper = styled.div`
  margin-bottom: 1.5rem;
`

const ImageText = styled.p`
  font-weight: ${(props) => props.fontWeight};
  color: ${(props) => props.color};
`

const ImageUploadInput = styled.input`
  width: 100%;
  padding: 0.75rem 0.375rem;
  background-color: #fff;
  color: rgb(55, 65, 81);
  border-radius: 0.25rem;
  border: solid 1px rgb(209, 213, 219);

  &:focus {
    outline: none;
    color: rgb(55, 65, 81);
    opacity: 1;
    background-color: #fff;
    border: solid 1px rgb(209, 213, 219);
  }
`
const BtnSubmit = styled.button`
  background-color: #1d4ed8;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  padding: 1rem 2.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: small;
  text-transform: uppercase;
  border: none;
  border-radius: 0.25rem;
  margin-bottom: 1.5rem;
  -webkit-box-shadow: 2px 2px 5px -3px rgba(55, 65, 81, 0.48);
  -moz-box-shadow: 2px 2px 5px -3px rgba(55, 65, 81, 0.48);
  box-shadow: 2px 2px 5px -3px rgba(55, 65, 81, 0.48);
`

const CreateListing = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    type: 'rent',
    name: '',
    bedrooms: 1,
    bathrooms: 1,
    parking: false,
    furnished: false,
    address: '',
    description: '',
    offer: false,
    price: 0,
    discount: 0,
    images: {},
  })

  const {
    type,
    name,
    bedrooms,
    bathrooms,
    parking,
    furnished,
    address,
    description,
    offer,
    price,
    discount,
    images,
  } = formData

  const onChange = (e) => {
    let boolean = null

    if (e.target.value === 'true') {
      boolean = true
    }

    if (e.target.value === 'false') {
      boolean = false
    }

    // For Files
    if (e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        images: e.target.files,
      }))
    }

    // For Text/Boolean/Number
    if (!e.target.files) {
      setFormData((prevState) => ({
        ...prevState,
        [e.target.name]: boolean ?? e.target.value,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (discount >= price) {
      setLoading(false)
      toast.error('Discounted price needs to be less than regular price')
      return
    }

    if (images.length > 3) {
      setLoading(false)
      toast.error('Maximum of 3 images allowed')
      return
    }

    const storeImage = async (image) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage()
        const filename = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`
        const storageRef = ref(storage, filename)
        const uploadTask = uploadBytesResumable(storageRef, image)

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case 'paused':
                console.log('Upload is paused')
                break
              case 'running':
                console.log('Upload is running')
                break
            }
          },
          (error) => {
            reject(error)
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL)
            })
          },
        )
      })
    }

    const imgUrls = await Promise.all(
      [...images].map((img) => storeImage(img)),
    ).catch((error) => {
      setLoading(false)
      toast.error('Images not uploaded')
      return
    })

    // Now add to firestore db
    const formDataCopy = {
      ...formData,
      imgUrls,
      timestamp: serverTimestamp(),
      userRef: auth.currentUser.uid,
    }

    delete formDataCopy.images
    !formDataCopy.offer && delete formDataCopy.discount

    const docRef = await addDoc(collection(db, 'listings'), formDataCopy)
    setLoading(false)
    toast.success('Listing created')
    navigate(`/category/${formDataCopy.type}/${docRef.id}`)
  }

  if (loading) {
    return <Spinner />
  }

  return (
    <Main>
      <Title>Create a Listing</Title>
      <Form>
        <Text>Sell / Rent</Text>
        <BtnWrapper>
          <Button
            style={{ marginRight: '1rem' }}
            type='button'
            name='type'
            value='sale'
            color={type === 'sale' ? '#fff' : '#445469'}
            bg={type === 'sale' ? '#445469' : '#fff'}
            onClick={onChange}
          >
            Sell
          </Button>

          <Button
            style={{ marginLeft: '1rem' }}
            type='button'
            name='type'
            value='rent'
            color={type === 'sale' ? '#445469' : '#fff'}
            bg={type === 'sale' ? '#fff' : '#445469'}
            onClick={onChange}
          >
            Rent
          </Button>
        </BtnWrapper>
        <PText>Name</PText>
        <Input
          type='text'
          name='name'
          value={name}
          onChange={onChange}
          placeholder='Property name'
          maxLength='32'
          minLength='10'
          required
        />

        <InputWrapper>
          <SmallInputWrapper>
            <SmallInputText>Beds</SmallInputText>
            <SmallInput
              type='number'
              name='bedrooms'
              value={bedrooms}
              onChange={onChange}
              min='1'
              max='50'
              required
            ></SmallInput>
          </SmallInputWrapper>

          <SmallInputWrapper>
            <SmallInputText>Baths</SmallInputText>
            <SmallInput
              type='number'
              name='bathrooms'
              value={bathrooms}
              onChange={onChange}
              min='1'
              max='50'
              required
            ></SmallInput>
          </SmallInputWrapper>
        </InputWrapper>

        <Text>Parking spot</Text>
        <BtnWrapper>
          <Button
            style={{ marginRight: '1rem' }}
            type='button'
            name='parking'
            value={true}
            color={!parking ? '#445469' : '#fff'}
            bg={!parking ? '#fff' : '#445469'}
            onClick={onChange}
          >
            Yes
          </Button>

          <Button
            style={{ marginLeft: '1rem' }}
            type='button'
            name='parking'
            value={false}
            color={parking ? '#445469' : '#fff'}
            bg={parking ? '#fff' : '#445469'}
            onClick={onChange}
          >
            No
          </Button>
        </BtnWrapper>

        <Text>Furnished</Text>
        <BtnWrapper>
          <Button
            style={{ marginRight: '1rem' }}
            type='button'
            name='furnished'
            value={true}
            color={!furnished ? '#445469' : '#fff'}
            bg={!furnished ? '#fff' : '#445469'}
            onClick={onChange}
          >
            Yes
          </Button>

          <Button
            style={{ marginLeft: '1rem' }}
            type='button'
            name='furnished'
            value={false}
            color={furnished ? '#445469' : '#fff'}
            bg={furnished ? '#fff' : '#445469'}
            onClick={onChange}
          >
            No
          </Button>
        </BtnWrapper>

        <PText>Address</PText>
        <TextArea
          type='text'
          name='address'
          value={address}
          onChange={onChange}
          placeholder='Address'
          required
        />

        <PText>Description</PText>
        <TextArea
          type='text'
          name='description'
          value={description}
          onChange={onChange}
          placeholder='Description'
          required
        />

        <Text>Offer</Text>
        <BtnWrapper bottomMargin='1.5rem'>
          <Button
            style={{ marginRight: '1rem' }}
            type='button'
            name='offer'
            value={true}
            color={!offer ? '#445469' : '#fff'}
            bg={!offer ? '#fff' : '#445469'}
            onClick={onChange}
          >
            Yes
          </Button>

          <Button
            style={{ marginLeft: '1rem' }}
            type='button'
            name='offer'
            value={false}
            color={offer ? '#445469' : '#fff'}
            bg={offer ? '#fff' : '#445469'}
            onClick={onChange}
          >
            No
          </Button>
        </BtnWrapper>

        <Text>Regular Price</Text>
        <InputWrapper>
          <SmallInputWrapper style={{ width: '48%' }}>
            <SmallInput
              type='number'
              name='price'
              value={price}
              onChange={onChange}
              min='50'
              max='400000000'
              required
            />
          </SmallInputWrapper>

          {type === 'rent' && (
            <SmallInputWrapper
              style={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                fontWeight: 'bold',
              }}
            >
              $/Month
            </SmallInputWrapper>
          )}
        </InputWrapper>

        {offer && (
          <>
            <Text>Discounted Price</Text>
            <InputWrapper>
              <SmallInputWrapper style={{ width: '48%' }}>
                <SmallInput
                  type='number'
                  name='discount'
                  value={discount}
                  onChange={onChange}
                  min='50'
                  max='400000000'
                  required={offer}
                />
              </SmallInputWrapper>
              $/Month
            </InputWrapper>
          </>
        )}

        <ImageUploadWrapper>
          <ImageText fontWeight='600'>Images</ImageText>
          <ImageText color='rgb(55, 65, 81)'>
            The first image will be the cover (max 6)
          </ImageText>
          <ImageUploadInput
            type='file'
            name='images'
            onChange={onChange}
            accept='.jpg,.png,.jpeg'
            multiple
            required
          />
        </ImageUploadWrapper>
        <BtnSubmit onClick={handleSubmit} type='submit'>
          Create Listing
        </BtnSubmit>
      </Form>
    </Main>
  )
}

export default CreateListing
