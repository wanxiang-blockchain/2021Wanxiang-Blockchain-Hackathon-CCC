import styled from 'styled-components'

export const RuleWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(270deg, #d0eaff 0%, #fcf0ff 100%);
  padding-top: 120px;
  padding-bottom: 100px;
  overflow: hidden;
`
export const RuleContentWrapper = styled.div``
export const RuleBlockWrapper = styled.div`
  width: 100%;
  margin-top: ${(props) => props.marginTop || 0}px;
  .content {
    text-align: center;
    width: 63%;
    margin: 0 auto;
  }

  h1 {
    font-size: 60px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #000000;
    line-height: 84px;
  }

  h2 {
    font-size: 40px;
    font-family: PingFangTC-Semibold, PingFangTC;
    font-weight: 600;
    color: #000000;
    line-height: 56px;
  }
  h3 {
    font-size: 24px;
    font-family: PingFangTC-Semibold, PingFangTC;
    font-weight: 300;
    color: #000000;
    line-height: 33px;
    text-align: left;
  }
  h5 {
    font-size: 24px;
    font-family: PingFangTC-Semibold, PingFangTC;
    font-weight: 100;
    color: #6d7278;
    line-height: 33px;
    text-align: left;
  }

  p {
    font-size: 24px;
    font-family: PingFangTC-Regular, PingFangTC;
    font-weight: 400;
    color: #000000;
    line-height: 33px;
    text-align: left;
  }

  li {
    font-size: 20px;
    font-family: PingFangTC-Regular, PingFangTC;
    font-weight: 400;
    color: #6d7278;
    line-height: 28px;
    text-align: left;
  }

  .picture_content {
    background: url(${(props) => props.itemBg}) no-repeat center bottom;
    background-size: 100% 100%;
    text-align: center;
    padding-top: 36px;
    padding-bottom: 36px;
    h2 {
      font-size: 40px;
      font-family: PingFangTC-Semibold, PingFangTC;
      font-weight: 600;
      color: #ffffff;
      line-height: 56px;
    }
  }
  .box {
    display: flex;
    justify-content: center;
    margin-left: 10%;
    margin-right: 10%;
    gap: 5%;

    .item {
      border-radius: 8px 8px 0px 8px;

      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        margin-bottom: 30px;
      }

      p {
        font-size: 24px;
        font-family: PingFangTC-Medium, PingFangTC;
        font-weight: 500;
        color: #ffffff;
        line-height: 33px;
      }

      b {
        color: #000;
      }

      &::before {
        content: '';
        display: inline-block;
        border-radius: 50%;
        width: 10px;
        height: 10px;
        background-color: #377db8;

        position: absolute;
        top: 15px;
        left: 0;
      }
    }
  }
`
