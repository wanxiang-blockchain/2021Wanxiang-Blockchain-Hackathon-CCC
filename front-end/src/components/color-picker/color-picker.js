import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const ColorPickerWrapper = styled.div(
  ...pxToRem`
  position: relative;
  width: 387px;
  height: 480px;
`
)

export const MapWrapper = styled.div(
  ...pxToRem`
  position: absolute;
  width: 262px;
  height: 262px;
  left:63px;
  top: 25px;
  overflow: hidden;
  user-select: none;
  border-radius: 4px;

  .active {
    cursor: none;
  }

  .dark .pointer {
    border-color: #fff;
  }

  .light .pointer {
    border-color: #000;
  }

  

  .background {
    top: 0;
    left: 0;
    position: absolute;
    height: 100%;
    width: 100%;
    
  }

  .pointer {
    position: absolute;
    width: 10px;
    height: 10px;
    margin-left: -5px;
    margin-bottom: -5px;
    border-radius: 100%;
    border: 1px solid #000;
    will-change: left, bottom;
  }

  .background:before,
  .background:after {
    display: block;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }

  .background:after {
    background: linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,1) 100%);
  }

  .background:before {
    background: linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%);
  }

}
`
)

export const HuaSliderWrapper = styled.div(
  ...pxToRem`
  position: absolute;
  top: 320px;
  width: 260px;
  height: 15px;
  left: 65px;

  .slider {
    background-size: 8px 8px;
    height: 8px;
    position: relative;
    .track {
      height: 8px;
      background: linear-gradient(to right,
        #FF0000 0%,
        #FF9900 10%,
        #CDFF00 20%,
        #35FF00 30%,
        #00FF66 40%,
        #00FFFD 50%,
        #0066FF 60%,
        #3200FF 70%,
        #CD00FF 80%,
        #FF0099 90%,
        #FF0000 100%
      );
    }
    .pointer {
      position: absolute;
      width: 10px;
      height: 10px;
      margin-left: -5px;
      bottom: 0px;
      border-radius: 100%;
      border: 1px solid #000;
      will-change: left, bottom;
    }
  }
}
`
)

export const OpacitySliderWrapper = styled.div(
  ...pxToRem`
  position: absolute;
  top: 340px;
  left: 65px;
  width: 260px;
  height: 15px;
  .track {
    width: 100%;
    position: absolute;
    height: 8px;
    background: linear-gradient(to right,
      rgba(255,255,255,0) 0%,
      rgba(255,255,255,1) 100%
    );
  }
  .slider {
    background: #fff url('data:image/gif;base64,R0lGODdhEAAQAPEAAMvLy8zMzP///wAAACwAAAAAEAAQAEACHYxvosstCAEMrq6Jj812Y59NIDQipdY5XLWqH4sVADs=') repeat;
    background-size: 8px 8px;
    height: 8px;
    position: relative;
    .pointer {
      position: absolute;
      width: 10px;
      height: 10px;
      margin-left: -5px;
      bottom: 0px;
      border-radius: 100%;
      border: 1px solid #000;
      will-change: left, bottom;
    }
  }

}
`
)

export const ColorInputWrapper = styled.div(
  ...pxToRem`

  position: absolute;
  top: 370px;
  left: 9px;
  width: 367px;
  display:flex;
  gap: 2px;
  justify-content:center;
  align-items:center; 

  .content {
    width: ${(props) => props.width};
    justify-content:center;
    align-items:center; 
  }
`
)

export const ColorInputContent = styled.div(
  ...pxToRem`
  width: ${(props) => props.width};
  justify-content:center;
  align-items:center;
`
)
