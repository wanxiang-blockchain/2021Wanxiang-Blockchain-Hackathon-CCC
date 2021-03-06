import styled from 'styled-components'

import { pxToRem } from '@/utils/utils'

export const LoginButtonBg = styled.div(
  ...pxToRem`
    align-items:center;
    justify-content:center;
    display:flex;
    gap: 10px;
    width: 143px;
    height: 44px;
    border-radius:10px;
    background: ${(propos) => propos.background};
`
)

export const LoginImg = styled.img(
  ...pxToRem`
  width: 60px;
  height: auto;
`
)

export const LoginOutBg = styled.div(
  ...pxToRem`
  align-items:center;
  justify-content:center;
  display:flex;
  width: 74px;
  padding: 7px;
  border-radius:50%;
  background-color:#f9ce0d;
`
)
