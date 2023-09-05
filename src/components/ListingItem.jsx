import React from 'react'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import { MdLocationOn } from 'react-icons/md'
import { FaTrash } from 'react-icons/fa'
import { MdEdit } from 'react-icons/md'
import styled from 'styled-components'
import { medium, small } from '../responsive'
// import moment from 'moment'
// moment().format()

const ListItem = styled.li`
  position: relative;
  background-color: #fff;
  list-style: none;
  border-radius: 0.5rem;
  overflow: hidden;
  margin: 1rem;
  width: 20%;

  ${medium({
    width: '40%',
  })};

  ${small({
    width: '90%',
  })};
`
const Image = styled.img`
  height: 170px;
  width: 100%;
  object-fit: cover;
  transition: all 0.2s ease-in;

  &:hover {
    scale: 1.05;
  }
`

const MapIconWrapper = styled.div`
  padding: 1rem 0 1rem 1rem;
`

const MapIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

const Text = styled.p`
  font-size: small;
  font-weight: bold;
  margin-bottom: 2px;
  color: gray;
`

const BedsWrapper = styled.div`
  color: #457b9d;
  display: flex;
`

const Beds = styled.div`
  padding-right: 1rem;
`

const Baths = styled.div``

const TextBeds = styled.p`
  font-weight: bold;
  margin-top: 1rem;
`

const TextOffer = styled.p`
  margin-top: 1rem;
  color: #5f5c5c;
  font-weight: bold;
  font-size: 1.2rem;
`

const TextName = styled.p`
  font-weight: 600;
  margin-top: 2px;
  color: #457b9d;
  font-size: x-large;
`

const ListingItem = ({ listing, id, handleDelete, handleEdit }) => {
  return (
    <ListItem>
      <Link
        style={{ textDecoration: 'none' }}
        to={`/category/${listing.type}/${id}`}
      >
        <Image loading={'lazy'} src={listing.imgUrls[0]} alt='Listing' />
        <Moment
          fromNow
          style={{
            position: 'absolute',
            top: '0.5rem',
            left: '0.5rem',
            backgroundColor: '#3377cc',
            color: '#fff',
            textTransform: 'uppercase',
            fontSize: 'x-small',
            borderRadius: '0.25rem',
            padding: '0.25rem 0.5rem',
          }}
        >
          {listing.timstamp?.toDate()}
        </Moment>
        {/* {moment(listing.timstamp?.toDate()).fromNow()} */}
        <MapIconWrapper>
          <MapIcon>
            <MdLocationOn style={{ fontSize: '1.2rem', color: '#42a535' }} />
            <Text>{listing.address}</Text>
          </MapIcon>
          <TextName>{listing.name}</TextName>
          <TextOffer>
            $
            {listing.offer
              ? listing.discount
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              : listing.price}
            {listing.type === 'rent' && ' / month'}
          </TextOffer>
          <BedsWrapper>
            <Beds>
              <TextBeds>
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : '1 Bed'}
              </TextBeds>
            </Beds>
            <Baths>
              <TextBeds>
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : '1 Bath'}
              </TextBeds>
            </Baths>
          </BedsWrapper>
        </MapIconWrapper>
      </Link>

      {handleDelete && (
        <FaTrash
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            cursor: 'pointer',
            color: 'red',
            fontSize: '0.8rem',
          }}
          onClick={() => handleDelete(listing.id)}
        />
      )}

      {handleEdit && (
        <MdEdit
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '3rem',
            cursor: 'pointer',
            color: '#202020',
            fontSize: '0.8rem',
          }}
          onClick={() => handleEdit(listing.id)}
        />
      )}
    </ListItem>
  )
}

export default ListingItem
