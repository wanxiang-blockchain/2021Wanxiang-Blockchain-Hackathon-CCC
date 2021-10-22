import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const HomePage = styled.div(
  ...pxToRem`
  width:100%;
  background: #fff;
`
)

export const FirstPage = styled.div(
  ...pxToRem`
  width:100%;
  position: relative;
  .know-more {
    position: absolute;
    left: 8%;
    top: 60%;
    z-index: 1;
    background-color:#fff;
    border-radius: 30px;
    width: 140px;
    height: 40px;
  }
  .description {
    position: absolute;
    left: 8%;
    top: 46%;
    z-index: 1;
  }
  .down-more-bg {
    position: absolute;
    width: 100%;
    top: 0%;
    height: 100vh;
    z-index: 9;
  }
  .down-more {
    position: absolute;
    left: 50%;
    bottom: 0px;
    transform: translateX(-50%);
    z-index: 1;
    height: 100px;
    width: 50px;
    border: 1px solid transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50px;
    &:hover {
      cursor: pointer;
    }
    span {
      position: absolute;
      font-size: 20px;
      color:#fff;
      animation: down 1s infinite;
    }
  }

  @keyframes down{
    from {
      top: 36%;
      opacity: 0;
    }
    to {
      top: 46%;
      opacity: 1;
    }
  }
`
)

export const MultiCanvasPage = styled.div(
  ...pxToRem`
  width:100%;
`
)
export const RoadMapWrapper = styled.div(
  ...pxToRem`
  width:100%;
  padding: 100px 0;
  text-align: center;
  .title{
    color:#000000;
    font-size: 30px;
    text-align: center;
    font-weight: bold;
    margin-bottom: 100px;
  }
  .ant-carousel {
    .slick-dots {
      bottom: -60px;
      li {
        button {
          background: #D8D8D8;
        }
      }
      .slick-active {
        button {
          background: #4338CA;
        }
      }
    }
    .slick-dots-bottom{
      // .ant-carousel .slick-dots li button
    }
  }
`
)
