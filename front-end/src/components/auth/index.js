import React, { useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import { Popover, Button, Typography } from 'antd'
import PropTypes, { bool } from 'prop-types'
import { actions } from './store'
import { principalToAccountId } from '@/utils/utils'
import Dfinity from '@/assets/images/dfinity.png'
import LoginOut from '@/assets/images/login_out.png'
import { initLoginStates, authLogin, authLoginOut } from '@/api/handler'
import { LoginButtonBg, LoginImg, LoginOutBg } from './style'

const { Paragraph } = Typography

const Auth = React.memo((props) => {
  const [accountId, setAccountId] = useState('')

  const handlerAuthInfo = async (authClient) => {
    const identity = await authClient.getIdentity()
    const boolean = await authClient.isAuthenticated()
    const principal = identity.getPrincipal()
    setAccountId(principalToAccountId(principal))
    const authToken = principal.toText()
    props.handleStates(boolean, identity, authToken)
  }

  // 初始化身份验证
  const init = useCallback(async () => {
    const authClient = await initLoginStates()
    handlerAuthInfo(authClient)
  }, [])

  const handleLogout = async () => {
    const authClient = await authLoginOut()
    handlerAuthInfo(authClient)
  }

  const handleLogin = useCallback(async () => {
    authLogin((authClient) => {
      handlerAuthInfo(authClient)
    })
  }, [])

  useEffect(async () => {
    await init()
  }, [])

  return (
    <>
      {props.isAuth && props.authToken !== '2vxsx-fae' ? (
        <LoginButtonBg background={'#ffffff00'}>
          <Popover
            placement="bottomRight"
            content={
              <div>
                Principal: <Paragraph copyable>{props.authToken}</Paragraph>
                Account ID: <Paragraph copyable>{accountId}</Paragraph>
              </div>
            }
            trigger="click"
          >
            <Button type="yellow15">{props.authToken.slice(0, 10)}...</Button>
          </Popover>
          <LoginOutBg onClick={handleLogout}>
            <img src={LoginOut}></img>
          </LoginOutBg>
        </LoginButtonBg>
      ) : (
        <LoginButtonBg background={'#000000'}>
          <LoginImg src={Dfinity} block={props.isBlock} onClick={handleLogin}></LoginImg>
        </LoginButtonBg>
      )}
    </>
  )
})

const mapStateToProps = (state) => {
  if (state.auth) {
    let res = {
      isAuth: state.auth.get('isAuth'),
      authToken: state.auth.get('authToken')
    }
    return res
  }
}

const mapDispatchToProps = (dispatch) => ({
  handleStates(status, identity, authToken) {
    let action = actions.setAuthStatus(status)
    dispatch(action)
    action = actions.setIdentity(identity)
    dispatch(action)
    action = actions.setAuthToken(authToken)
    dispatch(action)
  }
})

Auth.propTypes = {
  isBlock: PropTypes.bool
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)
