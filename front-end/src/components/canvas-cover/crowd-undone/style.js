import styled from 'styled-components'

export const CrowdUndoneCoverAvailableWrapper = styled.div`
  width: 1115px;
  height: 485px;
  background: #fff;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.08);
  border-radius: 20px;
  margin: 0 auto;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  .pixel-wrapper {
    border-radius: 20px;
    border: 1px dotted #ccc;
  }
  .info-right {
    flex: 1;
    padding-left: 46px;
    .canvas-index {
      span {
        display: inline-block;
        &:nth-child(1) {
          height: 60px;
          font-size: 48px;
          font-family: PingFangTC-Semibold, PingFangTC;
          font-weight: 600;
          color: #000;
          line-height: 60px;
          margin-right: 40px;
        }
        &:nth-child(2),
        &:nth-child(3) {
          height: 40px;
          font-size: 30px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #6d7278;
          line-height: 42px;
        }
        &:nth-child(3) {
          color: #4338ca;
        }
      }
    }
    ul {
      min-height: 245px;
      margin: 30px 0;
      li {
        font-size: 20px;
        color: #939393;
        list-style: none;
        line-height: 35px;
        margin-left: -40px;
        label {
          display: inline-block;
          padding-right: 10px;
        }
      }
    }
    .canvas-edit {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .price {
        height: 67px;
        font-size: 48px;
        font-family: PingFangTC-Semibold, PingFangTC;
        font-weight: 600;
        color: #4338ca;
        line-height: 67px;
      }
      .btn-edit {
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
`
