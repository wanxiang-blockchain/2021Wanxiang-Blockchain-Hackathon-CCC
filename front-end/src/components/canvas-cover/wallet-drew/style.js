import styled from 'styled-components'

export const WalletDrewCoverWrapper = styled.div`
  width: 362px;
  height: 440px;
  background-color: #fff;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 20px;

  .pixel-wrapper {
    width: 330px;
    height: 330px;
    padding: 15px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 15px;
    border-radius: 20px;
    border: 1px dotted #ccc;
  }

  .footer-wrapper {
    width: 100%;
    padding: 14px;
    .text {
      font-size: 16px;
      display: flex;
      justify-content: space-between;
      .worth {
        span {
          padding-left: 5px;
          color: #f9ce0d;
        }
      }
    }
    .btn {
      text-align: center;
      width: 100%;
      margin-top: 10px;
    }
    .btns {
      display: flex;
      justify-content: space-between;
    }
  }

  .canvas-name {
    width: 100%;
    position: absolute;
    bottom: 100px;
    color: #000000;
    text-align: center;
  }

  .canvas-index {
    width: 100%;
    position: absolute;
    bottom: 70px;
    color: #6d7278;
    text-align: center;
  }

  .canvas-worth {
    width: 100%;
    position: absolute;
    bottom: 10px;
    color: #1d1d1d;
    text-align: center;
  }

  .cover-edit {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
`
