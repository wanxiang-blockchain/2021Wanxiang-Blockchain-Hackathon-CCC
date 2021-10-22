import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const NFTContentWrapper = styled.div(
  ...pxToRem`
  width:100%;

`
)

export const NFTListWrapper = styled.div(
  ...pxToRem`
  margin-top: 6px;
  width:100%;
  .nft-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, 380px);
    justify-content: center;
    gap: 6px;
    margin-top: 10px;
  }
`
)
