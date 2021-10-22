import React, { Component } from 'react'

export default class CountDown extends Component {
  timer
  constructor(props) {
    super(props)
    this.state = {
      day: 0,
      hour: 0,
      minute: 0,
      second: 0
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.endTime !== nextProps.endTime) {
      this.timer && clearInterval(this.timer)
      this.timer = 0
      this.countFun(nextProps.endTime)
    } else {
      if (!this.timer) {
        this.countFun(nextProps.endTime)
      }
    }
  }

  //组件卸载取消倒计时
  componentWillUnmount() {
    clearInterval(this.timer)
    this.timer = 0
  }

  countFun = (time) => {
    let sys_second = time - new Date().getTime()
    console.log('countFun = ', sys_second, ',time = ', time)
    // 将倒计时方法抽出，立即触发第一次倒计时
    const startTimer = () => {
      //防止倒计时出现负数
      if (sys_second > 1000) {
        sys_second -= 1000
        let day = Math.floor(sys_second / 1000 / 3600 / 24)
        let hour = Math.floor((sys_second / 1000 / 3600) % 24)
        let minute = Math.floor((sys_second / 1000 / 60) % 60)
        let second = Math.floor((sys_second / 1000) % 60)
        this.setState({
          day: day,
          hour: hour < 10 ? '0' + hour : hour,
          minute: minute < 10 ? '0' + minute : minute,
          second: second < 10 ? '0' + second : second
        })
      } else {
        clearInterval(this.timer)
        this.timer = 0
        //倒计时结束时触发父组件的方法
        this.props.endTimeFun && this.props.endTimeFun()
      }
      return startTimer
    }

    this.timer = setInterval(startTimer(), 1000)
  }

  render() {
    const { day, hour, minute, second } = this.state
    return (
      <>
        {day ? `${day} day` : ''}
        {hour && hour !== '00' ? `${hour}:` : ''}
        {minute == '0' ? '00' : minute}:{second == '0' ? '00' : second}
      </>
    )
  }
}
