import React, { useEffect, useState } from 'react'
import MarKetNFTItem from '@/components/canvas-cover'
import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { getMarketNFTByType } from '@/pages/home/store/actions'
import { AloneCreate, CrowdCreate } from '@/constants'
import { MarketListingWrapper, MarketTabbarRightContent } from './style'
import { createHashHistory } from 'history'
import { Tabs, Input, Pagination, Dropdown, Menu, Layout } from 'antd'
import ImgSearch from '@/assets/images/market/search.png'
import { DownOutlined } from '@ant-design/icons'

const { Content, Footer } = Layout
//const { Search } = Input
const { TabPane } = Tabs

function MarketPlace(props) {
  const pageCount = 20
  const dispatch = useDispatch()
  const [curType, setCurType] = useState(CrowdCreate)
  const [sortType, setSortType] = useState(0) //0:Price: low to High,1:Price: High to Low,2:Number
  const [curPage, setCurPage] = useState(1)
  const [searchInput, setSearchInput] = useState(null)
  const sortList = ['Price: Low to High', 'Price: High to Low', 'Number']
  const [searchContent, setSearchContent] = useState('')
  let alonefilterList
  let crowdfilterList
  let allfilterList
  const { isAuth, nftCrowdListing, nftAloneListing, allListing } = useSelector((state) => {
    let nftCrowdListing = (state.allcavans && state.allcavans.getIn(['multiMarket'])) || []
    let nftAloneListing = (state.allcavans && state.allcavans.getIn(['aloneMarket'])) || []
    return {
      isAuth: state.auth.getIn(['isAuth']) || false,
      nftCrowdListing: nftCrowdListing,
      nftAloneListing: nftAloneListing,
      allListing: [...nftCrowdListing, ...nftAloneListing]
    }
  }, shallowEqual)

  useEffect(() => {
    dispatch(getMarketNFTByType(CrowdCreate))
    dispatch(getMarketNFTByType(AloneCreate))
  }, [dispatch])

  const isAlone = (type) => {
    return type === AloneCreate
  }
  const onSearch = () => {
    setCurPage(1)
    setSearchContent(searchInput)
  }

  const onItemClick = (info, type) => {
    let history = createHashHistory()
    history.push(`/detail/${type}/${info.canvasInfo.tokenIndex}/${info.prinId}`)
  }

  const onChangeSortType = (e) => {
    if (parseInt(e.key) !== sortType) setSortType(parseInt(e.key))
  }

  const onChangeTab = (type) => {
    setCurType(type)
    setCurPage(1)
  }

  const onShowPageChange = (page) => {
    setCurPage(page)
  }

  const onInputChange = (e) => {
    setSearchInput(e.target.value)
  }
  const getCurPageContent = (type) => {
    let list
    if (type === 'all') list = allListing
    else if (type === AloneCreate) list = nftAloneListing
    else list = nftCrowdListing
    list &&
      list.sort((left, right) => {
        let value
        sortType === 0 && (value = left.sellPrice - right.sellPrice)
        sortType === 1 && (value = right.sellPrice - left.sellPrice)
        sortType === 2 && (value = parseInt(left.baseInfo[0]) - parseInt(right.baseInfo[0]))
        return value
      })

    if (list) {
      let filterList = list.filter((item) => {
        if (searchContent) {
          return parseInt(item.baseInfo[0]).toString().indexOf(searchContent) !== -1
        }
        return true
      })
      if (type === 'all') allfilterList = filterList
      else if (type === AloneCreate) alonefilterList = filterList
      else crowdfilterList = filterList
      let start = (curPage - 1) * pageCount
      let end = start + pageCount > filterList.length ? filterList.length : start + pageCount
      let pageList = filterList.slice(start, end)
      return (
        pageList &&
        pageList.map((item) => {
          return (
            <MarKetNFTItem
              key={item.baseInfo[1].toText()}
              type={item.nftType}
              info={item.baseInfo}
              thumbType={'market-nft'}
              className="nft-list"
              onItemClick={onItemClick}
            ></MarKetNFTItem>
          )
        })
      )
    }
  }

  const menu = (
    <Menu onClick={onChangeSortType}>
      <Menu.Item key={0}>{sortList[0]}</Menu.Item>
      <Menu.Item key={1}>{sortList[1]}</Menu.Item>
      <Menu.Item key={2}>{sortList[2]}</Menu.Item>
    </Menu>
  )

  return (
    <Layout
      style={{
        minHeight: '100vh',
        paddingTop: '140px',
        background: 'linear-gradient(270deg, #d0eaff 0%, #fcf0ff 100%)'
      }}
    >
      <Content style={{ margin: '0 49px' }}>
        <Tabs
          className="tabs"
          tabBarExtraContent={
            <MarketTabbarRightContent>
              <div className="search-input-content">
                <Input className="input-style" placeholder="ID Search…" onChange={(e) => this.inputChange(e)} />
                <img src={ImgSearch} onClick={onSearch}></img>
              </div>
              <Dropdown className="radio-group" overlay={menu}>
                <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
                  {sortList[sortType]} <DownOutlined />
                </a>
              </Dropdown>
            </MarketTabbarRightContent>
          }
          onChange={onChangeTab}
        >
          <TabPane tab="All NFT" key={'all'}>
            <MarketListingWrapper>
              <div className="nft-list">{getCurPageContent('all')}</div>
            </MarketListingWrapper>
          </TabPane>
          <TabPane tab="Crowded NFT" key={CrowdCreate}>
            <MarketListingWrapper>
              <div className="nft-list">{getCurPageContent(CrowdCreate)}</div>
            </MarketListingWrapper>
          </TabPane>
          <TabPane tab="Personal NFT" key={AloneCreate}>
            <MarketListingWrapper>
              <div className="nft-list">{getCurPageContent(AloneCreate)}</div>
            </MarketListingWrapper>
          </TabPane>
        </Tabs>
      </Content>
      <Footer style={{ textAlign: 'right', background: '#0000' }}>
        <Pagination
          className="pagination"
          hideOnSinglePage={false}
          defaultCurrent={curPage}
          current={curPage}
          total={
            curType === 'all'
              ? allfilterList
                ? allfilterList.length
                : 0
              : isAlone(curType)
              ? alonefilterList
                ? alonefilterList.length
                : 0
              : crowdfilterList
              ? crowdfilterList.length
              : 0
          }
          pageSize={pageCount}
          onChange={onShowPageChange}
          showTotal={(e) => {
            return 'Total ' + e + ' NFTs'
          }}
        />
      </Footer>
    </Layout>
  )
}

export default MarketPlace
