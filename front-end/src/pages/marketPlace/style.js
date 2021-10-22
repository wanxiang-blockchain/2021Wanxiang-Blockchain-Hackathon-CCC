import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const MarketTabbarRightContent = styled.div(
  ...pxToRem`
  width: 434px;
  .search-input-content {
    width: 434px;
    height: 48px;
    background: #FFFFFF;
    border-radius: 6px;
    align-items:center;
    justify-content:center;
    display:flex;
    gap: 20px;
  }
  .input-style {
    background: #0000;
    width: 350px;
    border: none;
  }
  .radio-group {
    width: 253px;
    justify-content: center;
    align-items: center;
    float: right;
    margin-top: 10px;
    color: #4338ca !important;
    text-align: right !important;
  }
`
)

export const MarketListingWrapper = styled.div(
  ...pxToRem`
  margin-top: 2%;
  .nft-list {
    display: flex;
    flex-wrap: wrap;
    gap: 11px;
    margin-top: 10px;
  }
`
)
