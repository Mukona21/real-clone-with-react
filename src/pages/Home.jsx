import {
  collection,
  db,
  getDocs,
  orderBy,
  query,
  where,
  limit,
} from '../firebase'
import { useEffect, useState } from 'react'
import Slider from '../components/Slider'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

const ListingWrapper = styled.div`
  max-width: 72rem;
  margin: 0 auto;
  padding-top: 1rem;
`
const Listing = styled.div`
  margin: 0.75rem;
  margin-bottom: 1rem;
`
const HeadingText = styled.h2`
  padding: 0 0.5rem;
  font-weight: 600;
`
const LinkText = styled.p`
  padding: 0 0.5rem;
  font-size: small;
  color: blue;
`
const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0;
`

const Home = () => {
  // For Offers
  const [offerListings, setOfferListings] = useState(null)
  const [rentListings, setRentListings] = useState(null)
  const [saleListings, setSaleListings] = useState(null)

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Get reference
        const listingsRef = collection(db, 'listings')
        // create the query
        const q = query(
          listingsRef,
          where('offer', '==', true),
          orderBy('timestamp', 'desc'),
          limit(4),
        )

        // execute query
        const querySnap = await getDocs(q)

        //loop through the list returned and store in an array
        const listings = []
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setOfferListings(listings)
      } catch (error) {
        console.log(error)
      }
    }

    fetchListings()
  }, [])

  // For Rent
  useEffect(() => {
    const fetchRentListings = async () => {
      try {
        // Get reference
        const rentListingsRef = collection(db, 'listings')
        // create the query
        const q = query(
          rentListingsRef,
          where('type', '==', 'rent'),
          orderBy('timestamp', 'desc'),
          limit(4),
        )

        // execute query
        const querySnap = await getDocs(q)

        //loop through the list returned and store in an array
        const rentListings = []
        querySnap.forEach((doc) => {
          return rentListings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setRentListings(rentListings)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRentListings()
  }, [])

  // For Sale
  useEffect(() => {
    const fetchSaleListings = async () => {
      try {
        // Get reference
        const saleListingsRef = collection(db, 'listings')
        // create the query
        const q = query(
          saleListingsRef,
          where('type', '==', 'sale'),
          orderBy('timestamp', 'desc'),
          limit(4),
        )

        // execute query
        const querySnap = await getDocs(q)

        //loop through the list returned and store in an array
        const listings = []
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })

        setSaleListings(listings)
      } catch (error) {
        console.log(error)
      }
    }

    fetchSaleListings()
  }, [])

  return (
    <div>
      <Slider />
      {offerListings && offerListings.length > 0 && (
        <ListingWrapper>
          <Listing>
            <HeadingText>Recent Offers</HeadingText>
            <Link to='/offers'>
              <LinkText>Show more offers</LinkText>
            </Link>
            <List>
              {offerListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </List>
          </Listing>
        </ListingWrapper>
      )}

      {rentListings && rentListings.length > 0 && (
        <ListingWrapper>
          <Listing>
            <HeadingText>Places for Rent</HeadingText>
            <Link to='/category/rent'>
              <LinkText>Show more places for rent</LinkText>
            </Link>
            <List>
              {rentListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </List>
          </Listing>
        </ListingWrapper>
      )}

      {saleListings && saleListings.length > 0 && (
        <ListingWrapper>
          <Listing>
            <HeadingText>Places for Sale</HeadingText>
            <Link to='/category/sale'>
              <LinkText>Show more places for sale</LinkText>
            </Link>
            <List>
              {saleListings.map((listing) => (
                <ListingItem
                  key={listing.id}
                  listing={listing.data}
                  id={listing.id}
                />
              ))}
            </List>
          </Listing>
        </ListingWrapper>
      )}
    </div>
  )
}

export default Home
