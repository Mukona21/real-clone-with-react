import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { toast } from 'react-toastify'
import {
  collection,
  db,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from '../firebase'
import Spinner from '../components/Spinner'
import ListingItem from '../components/ListingItem'
import { startAfter } from 'firebase/firestore'

const Wrapper = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding-top: 1rem;
`
const HeadingText = styled.h1`
  padding: 0 0.5rem;
  font-weight: 600;
  text-align: center;
`
const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
`
const Main = styled.main``

const Button = styled.button`
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  border: solid 1px gray;
  cursor: pointer;
`

const Offers = () => {
  const [offerPagelistings, setOfferPagelistings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastListing, setLastListing] = useState(null)

  useEffect(() => {
    const fetchOfferPageListings = async () => {
      try {
        const listingRef = collection(db, 'listings')
        const q = query(
          listingRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(4),
        )

        const querySnap = await getDocs(q)
        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastListing(lastVisible)
        const listings = []
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setOfferPagelistings(listings)
        setLoading(false)
      } catch (error) {
        toast.error('Could not fetch listing')
      }
    }
    fetchOfferPageListings()
  }, [])

  const fetchMoreListings = async () => {
    try {
      const listingRef = collection(db, 'listings')
      const q = query(
        listingRef,
        where('offer', '==', true),
        orderBy('timestamp', 'desc'),
        startAfter(lastListing),
        limit(4),
      )

      const querySnap = await getDocs(q)
      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastListing(lastVisible)
      const listings = []
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })

      setOfferPagelistings((prevState) => [...prevState, ...listings])
      setLoading(false)
    } catch (error) {
      toast.error('Could not fetch listing')
    }
  }

  return (
    <Wrapper>
      <HeadingText>Offers</HeadingText>
      {loading ? (
        <Spinner />
      ) : offerPagelistings.length > 0 ? (
        <>
          <Main>
            <List>
              {offerPagelistings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </List>
          </Main>
          {lastListing && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Button onClick={fetchMoreListings}>Load more</Button>
            </div>
          )}
        </>
      ) : (
        <p>There are no current offers</p>
      )}
    </Wrapper>
  )
}

export default Offers
