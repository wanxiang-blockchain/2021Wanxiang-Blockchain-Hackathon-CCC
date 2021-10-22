import React, { useState } from 'react'
import LeftMenu from '@/components/menu'
import WalletMenuConfig from '@/assets/scripts/walletMenu'
import { WalletWrapper, FlexWrapper, ScrollWrapper, RightContentWrapper, LeftMenuWrapper } from './style'
import background from '@/assets/images/wallet_bg.png'
import { Storage } from '@/utils/utils'
import MyWallet from './view/my-wallet'
import Drew from './view/drew'
import Offers from './view/offers'
import Favorites from './view/favorites'

function Wallet(props) {
  const contents = [<MyWallet />, <Drew />, <Offers />, <Favorites />]
  const initKey = Storage.get('walletItemKey') ? Storage.get('walletItemKey') : `${WalletMenuConfig[0].key}`
  const [curKey, setCurKey] = useState(initKey)

  const initContent = (key) => {
    for (let i = 0; i < WalletMenuConfig.length; i++) {
      if (WalletMenuConfig[i].key === key) {
        return contents[i]
      }
    }
  }

  const handlerItemSelect = (key) => {
    setCurKey(key)
  }

  return (
    <WalletWrapper bg={background}>
      <FlexWrapper>
        {/* 主体内容 */}
        <LeftMenuWrapper className="wallet" bg={background}>
          <LeftMenu
            MenuConfig={WalletMenuConfig}
            currKey={initKey}
            route={false}
            currentItemKey={'walletItemKey'}
            mode={'vertical'}
            minWidth={'299px'}
            handlerItemSelect={handlerItemSelect}
          />
        </LeftMenuWrapper>
        <ScrollWrapper>
          <RightContentWrapper>{initContent(curKey)}</RightContentWrapper>
        </ScrollWrapper>
      </FlexWrapper>
    </WalletWrapper>
  )
}

export default Wallet
