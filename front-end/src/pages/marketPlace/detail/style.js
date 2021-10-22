import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const MarketDetailWrapper = styled.div(
  ...pxToRem`
  width:100%;
  min-height: 100vh;
  display:flex;
  gap: 50px;
  align-items:center;
  justify-content:center;
  padding-top: 120px;
  background: linear-gradient(270deg, #D0EAFF 0%, #FCF0FF 100%);
  
`
)

export const MarketDetailLeft = styled.div`
  width: 700px;
  height: 700px;
  position: relative;
  background: #ffffff;
  border-radius: 4px;
  .canvas-pixel {
    width: 650px;
    height: 650px;
    padding: 25px;
    margin: 25px auto;
    border-radius: 20px;
    border: 1px dotted #ccc;
  }
`

export const MarketDetailRight = styled.div(
  ...pxToRem`
  width: 765px;
  .title {
    font-size: 48px;
    font-weight: 600;
    color: #000000;
    line-height: 67px;
  }
  .owner {
    margin-top:24px;
    display:flex;
    gap: 15px;
  }
  .seller {
    color:#4338CA;
  }

  
`
)

export const MarketDetailBlock = styled.div(
  ...pxToRem`
    background: #FFFFFF;
    border-radius: 4px;
    width: 100%;
    padding: 20px;
    height: ${(props) => props.height}px;
    background-color: #ffffff;
    margin-top: ${(props) => props.marginTop}px;
    .priceTip {
      font-size: 20px;
      font-weight: 400;
      color: #939393;
      line-height: 28px;
      margin-top: 10px;
    }
    .priceValue {
      font-size: 48px;
      font-weight: 600;
      color: #000000;
      line-height: 67px;
      margin-top: 10px;
    }
    .buy {
      width: 468px;
      height: 67px;
      margin-top: 10px;
      font-size: 24px;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 33px;
    }
    .titleLayout {
      display: flex;
      height: 100%;
      gap: 15px;
      padding-left:0px;
      align-items: center;
    }
    .titleValue{
      font-size: 24px;
      font-weight: 600;
      color: #000000;
      line-height: 33px;
      
    }
    .contentValue {
      font-size: 20px;
      font-weight: 400;
      color: #000000;
      margin-bottom: 10px;
      line-height: 28px;
    }
`
)
