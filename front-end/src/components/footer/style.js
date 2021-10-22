import styled from 'styled-components'
import { pxToRem } from '@/utils/utils'

export const FooterWrapper = styled.div(
  ...pxToRem`
  width: 100%;
  height: 400px;
  background: #4338CA ${(props) => 'url(' + props.bg + ')'} no-repeat center;
  background-size: contain;
  overflow: hidden;
  z-index: 0;
  position: relative;
  
  .content {
    width: 1250px;
    height: 300px;
    margin: 50px auto 0;
    background-color: rgba(255,255,255, 0.3);
    border-radius: 20px;
    padding-bottom: 10px;
  
    .form-wrapper {
      background-color: rgba(255,255,255, 0.6);
      border-radius: 20px 20px 0 0;
      padding: 50px 40px 40px;     
    } 
    h3 {
      height: 24px;
      font-size: 30px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #4338CA;
      line-height: 24px;
    }

    .txt {
      font-size: 24px;
      color: #fff;
    }

    .list {
      padding-right: 20px;
      padding-top: 10px;
      text-align: right;
      a {
        display: inline-block;
        margin-left: 25px;
      }
    }

    .ant-form-item {
      margin-right: 0;

      &-control-input-content {
        width: 400px;

        .ant-input {
          border-right: none;
          height: 70px;
          border-radius: 10px 0 0 10px;

          &:focus,
          &-focused {
            border-color: #d9d9d9;
          }
        }

        .ant-btn {
          min-width: 160px;
          height: 70px;
          background: #4338CA;
          border-radius: 0px 10px 10px 0px;

          &:hover,
          &:focus,
          &:active {
            border-color: #d9d9d9;
          }

          span {
            font-size: 24px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #fff;
          }
        }
      }
    }
  }
`
)
