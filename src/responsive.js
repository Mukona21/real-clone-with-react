import { css } from 'styled-components'

export const small = (props) => {
  return css`
    @media only screen and (max-width: 400px) {
      ${props}
    }
  `
}

export const medium = (props) => {
  return css`
    @media only screen and (max-width: 768px) {
      ${props}
    }
  `
}
