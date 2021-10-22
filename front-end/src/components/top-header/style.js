import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const TopHeaderWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: 100%;
  position: relative;
  .menu {
    padding-top: 25px;
    width: 70%;
    left: 15%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
  }
  .logo {
    padding-top: 30px;
    left: 33px;
    position: absolute;
    &:hover {
      cursor: pointer;
    }
  }
  .auth {
    padding-top: 35px;
    right: 40px;
    position: absolute;
  }
  .header {
    width: 100%;
    height: 120px;
    position: fixed;
    z-index: 10;
  }
  .header_bg {
    background: #ffffff;
  }
`
)
