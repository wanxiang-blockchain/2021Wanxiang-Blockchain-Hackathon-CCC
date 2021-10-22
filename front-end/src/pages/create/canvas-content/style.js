import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const MultiDrawWrapper = styled.div(
  ...pxToRem`
  width:100%;
  min-height: 100vh;
  background-color: #ffffff;
  
`
)

export const MultiTitleWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: 54px;
  background-color: ${(props) => props.backgroundColor};
  display: flex;
  gap: 15px;
  color: ${(props) => props.color};
  align-items:center; 
  justify-content:center;
`
)

export const MultiSubTitleWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: 54px;
  position: relative;
  background-color: #ffffff;
  color: #333333;
  .home {
    top: 10px;
    left: 40px;
    width: 30px;
    height:30px;
    position: absolute;
    border-radius:50%;
    background-color:#f9ce0d;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    width: 70%;
    left: 15%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
  }
  .wicp {
    height: 100%;
    right: 250px;
    width: 300px;
    color: #4338ca;
    text-align: right;
    line-height:54px;
    position: absolute;
  }
  .auth {
    top: 3px;
    right: 40px;
    position: absolute;
  }
`
)
export const MultiContentWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  width: 100%;
  display: flex;
  gap: 15px;
  justify-content:center;
  
`
)

export const MultiDrawLeft = styled.div(
  ...pxToRem`
  width: 387px;

  .thumb{
    display: flex;
    height: 100%;
    gap: 10px;
    justify-content:center;
    align-items:center;
    margin-top:20px;
  }

  .canvas{
    margin-left: 15px;
    width: 250px;
    height: 250px;
    border: 1px solid rgba(150,150,150);
  }

  .reset {
    width: 100px;
    height: 40px;
  }
  .eraser {
    width: 100px;
    height: 40px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`
)

export const MultiDrawRight = styled.div(
  ...pxToRem`
  width: 424px;
`
)

export const MultiDrawMiddle = styled.div`
  width: ${(props) => props.width + 'px'};
  height: ${(props) => props.width + 'px'};
  position: relative;
  border: 1px solid #555;
  background: #fff
    url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAADqADAAQAAAABAAAADgAAAAC98Dn6AAAAW0lEQVQoFWP8DwQMWMDv37/BoqysrFhkGRhYsIoCBXGYB1fOBGeRyBhCGllgoYfuRZg4IyMjuhSYz4Ir9GDiMBpdNwsbGxu6GAofl/wQClWynYozreKKBljIAQCh8hki1usO7QAAAABJRU5ErkJggg==')
    repeat;
  background-size: '100% 100%';
`

export const MultiToSelectBg = styled.div(
  ...pxToRem`
  width: ${(props) => props.width + 'px'};
  height: ${(props) => props.height + 'px'};
  position: absolute;
  left: ${(props) => props.left + 'px'};
  top: ${(props) => props.top + 'px'};
  border: 1px solid #555;

`
)

export const ColorPicker = styled.div(
  ...pxToRem`


`
)

export const BlockAreaWrapper = styled.div(
  ...pxToRem`
    width: ${(props) => props.width};
    min-height: ${(props) => props.height};
    background-color: #fff;
    border: 1px solid rgba(237,237,237.2);
    border-radius: 25px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
    margin-bottom: 20px;
    padding-bottom: 5px;
    .textContent{
        padding-left: 28px;
        padding-right: 28px;
        color:#B7B7B7;
    }
    .textDetail{
        padding-left: 28px;
        padding-right: 28px;
        margin-top: 10px;
        color:#333333;
    }
    .textSubDetail{
      padding-left: 48px;
      padding-right: 8px;
      color:#666666;
      margin-top: 6px;
    }
    .textTitle{
      padding-left: 28px;
      padding-right: 28px;
      margin-top: 15px;
      color:#000000;
    }
    .textPriceContent{
      padding-left: 28px;
      padding-right: 28px;
      min-height: 70px;
      display: flex;
      flex-direction: column;
      width:100%;
    }
    .totalPrice{
        margin-top:20px;
        color:#333333;
    }
    .totalNum{
        margin-top:15px;
        color:#333333;
    }
    .tips {
      color:#888888;
      font-size: 16px;
      margin-top: 70px;
      margin-bottom: 30px;
    }
    .buttonLayout{
      margin-top: 10px;
      display:flex;
      gap: 15px;
      align-items:center; 
      justify-content:center;
      width: 380px;
    }
    .confirm{
        width: 184px;
        height: 54px;
    }
    .withdraw {
      margin-left: 15px;
      width: 100px;
      height: 40px;
    }
`
)

export const BlockTitleWrapper = styled.div(
  ...pxToRem`
    display: flex;
    height: 50px;
    border-bottom: 1px solid rgba(237,237,237,1);
    padding-left: 10px;
    align-items:center;
    padding-left: 28px;
    gap: 10px;
    .curColor {
      width: 20px;
      height: 20px;
    }
`
)
