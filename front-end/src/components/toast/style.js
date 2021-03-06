import styled from "styled-components";
import {pxToRem} from '@/utils/utils'


export const ToastWrapper = styled.div(...pxToRem`
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1010;
    display: flex;
    flex-direction: column; 
    .toast_bg {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }
`)

export const ToastBoxWrapper = styled.div(...pxToRem`
    position: relative;
    left: 50%;
    top: 50%;
    width: 542px;
    height: 387px;
    margin: -193px -271px;
    background: #FFFFFF;
    border-radius: 20px;
    color: #000;
    justify-content:center;
    align-items:center;
`)



export const ToastIconWrapper = styled.div(...pxToRem`
    padding-top: 69px;
    width: 100%;
    display: flex;
    justify-content:center;
    align-items:center;
`)

export const ToastTextWrapper = styled.div(...pxToRem`
    padding-top:34px;
    width: 100%;
    color: ${props=>props.textColor};
    text-align:center;
    font-size: 20px;
`)
