import mywallet from '@/assets/images/wallet/my_wallet.png'
import drew from '@/assets/images/wallet/drew.png'
import offers from '@/assets/images/wallet/offers.png'
import favorite from '@/assets/images/wallet/favorite.png'

const WalletMenuConfig = [
  {
    title: 'My Wallet',
    key: 'mywallet',
    icon: mywallet,
    type: 'pink'
  },
  {
    title: 'Drew',
    key: 'drew',
    icon: drew,
    type: 'yellow'
  },
  {
    title: 'Offers',
    key: 'offers',
    icon: offers,
    type: 'green'
  },
  {
    title: 'Favorites',
    key: 'favorites',
    icon: favorite,
    type: 'red'
  }
]

export default WalletMenuConfig
