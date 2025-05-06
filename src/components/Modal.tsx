import React, { useEffect, useRef } from "react"
import { AiOutlineClose } from "react-icons/ai"
import styled, { css, keyframes } from "styled-components"
import { CSSTransition } from "react-transition-group"
import useOutsideClick from "@/hooks/useOutsideClick"

const Modal = ({
  children,
  open = false,
  eClose,
  title,
  borderRadius = false,
  width = "30%",
  height = "35%",
  outside = true
}:{
  children?: React.ReactNode,
  open: boolean,
  eClose: ()=>void,
  title: string,
  modalButton?: boolean,
  onButton1?: void,
  onButton2?: void,
  borderRadius?: boolean,
  width?: string,
  height?: string
  outside?: boolean
}) => {

  const modalRef = useRef(null);

  useOutsideClick(modalRef, eClose)

  return (
      <Container $open={open} >
        <ModalBackground>
          <Content
            $borderRadius={borderRadius}
            width={width}
            height={height}
            ref={outside ? modalRef : null}
            $open={open}
            className={`modal`}
          >
            <ModalHeader title={title}>
              <Header>
                <Title>
                  {title}
                </Title>
              </Header>
              <IconWrapper onClick={eClose}>
                <AiOutlineClose/>
              </IconWrapper>
            </ModalHeader>
            <ModalContent>
              {children}
            </ModalContent>
          </Content>
        </ModalBackground>
      </Container>
  )
}

export default Modal

const unfoldIn = keyframes`
  0% {
    transform: scaleY(0.005) scaleX(0);
  }
  50% {
    transform: scaleY(0.005) scaleX(1);
  }
  100% {
    transform: scaleY(1) scaleX(1);
  }
`;


const unfoldOut = keyframes`
  0% {
    transform: scaleY(1) scaleX(1);
  }
  50% {
    transform: scaleY(0.005) scaleX(1);
  }
  100% {
    transform: scaleY(0.005) scaleX(0);
  }
`;

const zoomIn = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

const zoomOut = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;

const ModalBackground = styled.div`
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  flex: 1;
`;

const Container = styled.div<{$open: boolean}>`
  display: flex;
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  /* overflow: auto; */
  justify-content: center;
  align-items: center;
  transform: scale(0);
  transform: scaleY(0.01) scaleX(0);
  animation: ${({$open})=>$open ? css`${unfoldIn} 1s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`
  :css`${unfoldOut} 1s 0.3s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`};
`;

interface ContentProps {
  $borderRadius?: boolean;
  width?: string;
  height?: string;
  $open: boolean
}

const Content = styled.div<ContentProps>`
padding-bottom: 15px;
  background-color: white;
  border: 1px solid #888;
  width: ${props => props.width && props.width};
  height: ${props => props.height && props.height};
  border-radius: ${props => (props.$borderRadius ? "10px" : "0")};
  position: relative;
  max-width: 90%;
  max-height: 90%;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  transform: scale(0);
  animation: ${({$open})=>$open ? css`${zoomIn} 0.5s 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`
  :css`${zoomOut} 0.5s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`};
  @media only screen and (max-width: 1024px) {
    width: 80%;
  }
  @media only screen and (max-width: 768px) {
    height: auto;
    width: 95%;
    min-width: 100%;
    max-height: 90%;
  }
`;

const IconWrapper = styled.div`
  font-size: 22px;
  text-align: end;
  font-weight: bold;
  cursor: pointer;
  background-color: #ff7878;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px;
  border-radius: 50%;
  transition: all .5s ease;
  &:hover {
    font-size: 20px;
    padding: 10px;
  }
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 0 20px;
  overflow-y: scroll;
  ::-webkit-scrollbar {
      width: 5px;
  }
  ::-webkit-scrollbar-track {
      box-shadow: inset 0 0 6px rgba(0,0,0,0.3); 
      border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      box-shadow: inset 0 0 6px rgba(0,0,0,0.5); 
  }
  @media only screen and (max-width: 768px) {
    padding: 5px;
    overflow-y: scroll;
  }
`;

interface ModalHeaderProps {
  title?: string;
}

const ModalHeader = styled.div<ModalHeaderProps>`
  display: ${props => (props.title ? "flex" : "none")};
  justify-content: space-between;
  padding: 10px;
  align-items: center;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  @media only screen and (max-width: 1023px) {
    padding: 5px;
  }
`;

const Header = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  @media only screen and (max-width: 1023px) {
    height: 20px;
  }
`;

const Title = styled.div`
  font-size: 16px;
  margin: 0 10px;
  display: flex;
  align-items: center;
  /* color: #716a6a; */
  font-weight: bold;
  @media only screen and (max-width: 1440px) {
    font-size: 23px;
  }
  @media only screen and (max-width: 1366px) {
    font-size: 18px;
  }
  @media only screen and (max-width: 1024px) {
    font-size: 16px;
  }
  @media only screen and (max-width: 445px) {
    font-size: 14px;
  }
`;
