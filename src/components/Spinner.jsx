import React from 'react'
import spinner from '../assets/spinner.svg'
import styled from 'styled-components'

const SpinnerWrapper = styled.div`
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
`

const Image = styled.img`
  height: 5rem;
`

const Spinner = () => {
  return (
    <SpinnerWrapper>
      <div>
        <Image src={spinner} alt='Loading' />
      </div>
    </SpinnerWrapper>
  )
}

export default Spinner
