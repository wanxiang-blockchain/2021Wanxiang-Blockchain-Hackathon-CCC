import styled from 'styled-components'

export const NFTMarketCoverWrapper = styled.div`
  width: 338px;
  box-shadow: 0px 0px 30px 0px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  background-color: #fff;

  .pixel-wrapper {
    width: 320px;
    height: 320px;
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
    margin-left: auto;
    margin-right: auto;
    justify-content: space-between;
    align-items: center;
    border-radius: 0 0 20px 20px;
    background-color: #fff;
  }
  .nft-index {
    float: left;
    margin-left: 13px;
    color: #6d7278;
  }
  .canvas-worth {
    float: right;
    margin-right: 13px;
    color: #4338ca;
  }
`
