import React, { useEffect, useState } from 'react'
import { Layout } from 'antd'
import TopMenu from '../menu'
import Auth from '../auth'
const { Header } = Layout
import { TopHeaderWrapper } from './style'
import MenuConfig from '@/assets/scripts/menu'
import Logo from '@/assets/images/logo-beta.png'
import { useHistory, withRouter } from 'react-router-dom'
import { Storage, handleScrollTop } from '@/utils/utils'

const TopHeader = React.memo((props) => {
  const history = useHistory()
  const [mlist] = useState(MenuConfig)
  const currKey =
    props.history.location.pathname ||
    (Storage.get('currentItemKey') ? Storage.get('currentItemKey') : `${mlist[0].key}`)

  const addScrollListener = () => {
    document.addEventListener('scroll', handleScroll)
  }
  const removeScrollListener = () => {
    document.removeEventListener('scroll', handleScroll)
  }

  const handleScroll = (e) => {
    var header = document.getElementById('header')
    if (window.pageYOffset >= 10) {
      //if语句判断window页面Y方向的位移是否大于或者等于导航栏的height像素值
      header.classList.add('header_bg') //当Y方向位移大于80px时，定义的变量增加一个新的样式'header_bg'
    } else {
      header.classList.remove('header_bg') //否则就移除'header_bg'样式
    }
  }

  useEffect(() => {
    addScrollListener()
    return () => {
      removeScrollListener
    }
  }, [])

  return (
    <TopHeaderWrapper>
      <div id="header" className="header">
        <div
          className="logo"
          onClick={() => {
            history.push('/all')
            window.scrollTo(0, 0)
          }}
        >
          <img src={Logo} />
        </div>
        <div className="menu">
          <Header style={{ backgroundColor: '#00000000' }}>
            <TopMenu
              MenuConfig={MenuConfig}
              currKey={currKey}
              currentItemKey={'currentItemKey'}
              mode={'horizontal'}
              handlerItemSelect={(key) => {
                key === '/all' ? history.push({ pathname: key, search: '?id=canvas' }) : history.push(key)
              }}
            />
          </Header>
        </div>
        <div className="auth">
          <Auth />
        </div>
      </div>
    </TopHeaderWrapper>
  )
})
export default withRouter(TopHeader)
