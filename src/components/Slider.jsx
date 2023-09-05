import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore, {
  EffectFade,
  Autoplay,
  Navigation,
  Pagination,
} from 'swiper'
import 'swiper/css/bundle'
import styled from 'styled-components'
import { query, collection, db, orderBy, getDocs, limit } from '../firebase'

const SliderImage = styled.div`
  background-image: ${(props) => props.bg};
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 300px;
  overflow-y: hidden;
  position: relative;
`
const Name = styled.p`
  padding: 0.5rem 1rem;
  background-color: #5788a6;
  /* width: 15rem; */
  border-bottom-right-radius: 2rem;
  color: #e7e3e3;
  font-weight: bold;
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
`

const Price = styled.p`
  padding: 0.5rem 1rem;
  background-color: #cf3441;
  /* width: 15rem; */
  border-top-right-radius: 2rem;
  color: #e7e3e3;
  font-weight: bold;
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
`

const Slider = () => {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  // Initialize swipper
  SwiperCore.use([Autoplay, Navigation, Pagination])

  const navigate = useNavigate()

  useEffect(() => {
    const fetchListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5))
      const querySnap = await getDocs(q)

      let listing = []
      querySnap.forEach((doc) => {
        return listing.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setListings(listing)
      setLoading(false)
    }

    fetchListings()
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (listings.length === 0) {
    return <></>
  }
  return (
    listings && (
      <>
        <Swiper
          slidesPerView={1}
          navigation
          pagination={{ type: 'progressbar' }}
          effect='fade'
          modules={{ EffectFade }}
          autoplay={{ delay: 3000 }}
        >
          {listings.map(({ data, id }) => (
            <SwiperSlide
              key={id}
              onClick={() => navigate(`/category/${data.type}/${id}`)}
            >
              <SliderImage bg={`url(${data.imgUrls[0]})`}></SliderImage>
              <Name>{data.name}</Name>
              <Price>
                ${data.discount ?? data.price}
                {data.type === 'rent' && ' / month'}
              </Price>
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    )
  )
}

export default Slider
