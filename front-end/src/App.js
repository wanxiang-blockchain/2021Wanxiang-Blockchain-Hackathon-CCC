import './App.less'
import { Layout } from 'antd'
import { HashRouter, Route, Redirect } from 'react-router-dom'
import React from 'react'
import 'antd/dist/antd.less'
import Home from './pages/home'
import MarketPlace from './pages/marketPlace'
import Create from './pages/create'
import CanvasContent from '@/pages/create/canvas-content'
import Wallet from './pages/wallet'
import Rule from './pages/rules'
import TopHeader from './components/top-header'
import Canvas from '@/pages/create/canvas-content'
import MarketDetail from '@/pages/marketPlace/detail'
const { Content } = Layout
const App = () => {
  return (
    <HashRouter>
      <>
        <Route path="/canvas/:type/:id" component={CanvasContent} />
        <Layout>
          <TopHeader />
          <Content>
            <Route exact path="/">
              <Redirect to="/all" />
            </Route>
            <Route path="/all" component={Home} />
            <Route path="/marketplace" component={MarketPlace} />
            <Route path="/create" component={Create} />
            <Route path="/wallet" component={Wallet} />
            <Route path="/rule" component={Rule} />
            <Route path="/detail/:type?/:index?/:prinId?" component={MarketDetail} />
          </Content>
        </Layout>
      </>
    </HashRouter>
  )
}

export default App
