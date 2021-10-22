import React, { memo, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Image, Carousel } from 'antd'
import { DoubleRightOutlined } from '@ant-design/icons'
import MultiList from './cpns/all-multi-canvas'
import Footer from '@/components/footer'
import { HomePage, FirstPage, RoadMapWrapper } from './style'
import background from '@/assets/images/background.png'
import Roadmap1 from '@/assets/images/footer/roadmap1.svg'
import Roadmap2 from '@/assets/images/footer/roadmap2.svg'
import { scrollAnimation } from '@/utils/utils'

function Home(props) {
  const history = useHistory()
  let bannerRef = useRef()
  let timerRef = useRef(null)
  const canvasId = props.location.search.split('=')[1]
  const handleScroll = () => {
    const h = bannerRef.current.clientHeight - 120
    scrollAnimation(0, h)
  }
  useEffect(() => {
    if (canvasId === 'canvas') {
      timerRef.current = setTimeout(() => {
        const h = bannerRef.current.clientHeight - 120
        scrollAnimation(0, h)
      }, 0)
    }
    return () => {
      clearTimeout(timerRef.current)
    }
  }, [])
  return (
    <HomePage>
      {/* banner */}
      <FirstPage ref={bannerRef}>
        <h2 className="description">Participate in painting and share the bonus pool and get NFT.</h2>
        {/* <Button className="know-more" onClick={() => {}}>
          Know more
        </Button> */}
        <div className="down-more-bg">
          <div className="down-more" onClick={handleScroll}>
            <DoubleRightOutlined rotate={90} />
          </div>
        </div>

        <Image src={background} preview={false} width="100%" />
      </FirstPage>
      {/* canvas */}
      <div id="canvas-wrap">
        <MultiList />
      </div>
      {/* road-mpa */}
      <RoadMapWrapper>
        <div className="title">Roadmap</div>
        <Carousel>
          <div>
            <Image src={Roadmap1} preview={false} />
          </div>
          <div>
            <Image src={Roadmap2} preview={false} />
          </div>
        </Carousel>
      </RoadMapWrapper>
      <Footer />
    </HomePage>
  )
}

export default memo(Home)
