import styled from 'styled-components'

export const NFTCoverWrapper = styled.div`
  width: 330px;
  height: 390px;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  background-color: #fff;

  .pixel-wrapper {
    width: 320px;
    height: 316px;
    padding: 10px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    border-radius: 20px;
    border: 1px dotted #ccc;
  }

  .detail {
    height: 64px;
    width: 100%;
    display: flex;
    padding-left: 10px;
    padding-right: 10px;
    justify-content: space-between;
    align-items: center;
    border-radius: 20px;
    background-color: #fff;
  }

  .info_content {
    width: 200px;
    align-items: center;
  }

  .nft-index {
    width: 100%;
    color: #6d7278;
    text-align: left;
  }

  .nft-price {
    width: 100%;
    color: #4338ca;
    text-align: left;
  }

  .nft-manage {
    width: 80px;
    height: 45px;
  }
`
