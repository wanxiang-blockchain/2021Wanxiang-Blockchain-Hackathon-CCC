import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const CreateWrapper = styled.div(
  ...pxToRem`
    width: 100%;
    min-height:100vh;
    position: relative;
`
)

export const CreateBgWrapper = styled.img`
  width: 100%;
  position: absolute;
  left: 0px;
  top: 0px;
`
export const CreateContentWrapper = styled.div(
  ...pxToRem`
    display: flex;
    height: 442px;
    position: absolute;
    top: 140px;
    width: 100%;
    justify-content:center;
    align-items:center;
    gap: 20px;
`
)

export const CreateItemWrapper = styled.div(
  ...pxToRem`
    width: 442px;
    height: 442px;
    position: relative;
    background-size: 100% 100%;
    background-image: ${(props) => 'url(' + props.itemBg + ')'};
    .cover {
        position: absolute;
        left: 30px;
        bottom: 29px;
        width:382px;
        height: 102px;
        background-size: 100% 100%;
        background-image:${(props) => 'url(' + props.itemCover + ')'};
        
    }
    .title {
        width: 100%;
        display:flex;
        font-weight:bold;
        color: #000000;
        position: absolute;
        bottom: 45px;
        font-size: 30px;
        justify-content:center;
        align-items:center;
    }
`
)
