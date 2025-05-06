import React from 'react'
import { CSSTransition } from 'react-transition-group';
import styled, { keyframes } from 'styled-components';
import Loading from './Loading';
import { getLoading } from '@/redux/loadingSlice';
import { useAppSelector } from '@/redux/hook';

export default function ModalLoading() {
    const loading = useAppSelector(getLoading);

  return (
    <CSSTransition in={loading.open} timeout={300} classNames="modal-transition" unmountOnExit>
      <Container >
        <Loading/>
      </Container>
    </CSSTransition>
  )
}

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const slideOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(100%);
  }
`;

const Container = styled.div`
  display: flex;
  position: fixed;
  z-index: 2;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
  justify-content: center;
  align-items: center;
`;

interface ContentProps {
  $borderRadius?: boolean;
  width?: string;
  height?: string;
}

const Content = styled.div<ContentProps>`
  background-color: white;
  border: 1px solid #888;
  width: ${props => props.width && props.width};
  height: ${props => props.height && props.height};
  border-radius: ${props => (props.$borderRadius ? "10px" : "0")};
  position: relative;
  max-width: 1386px;
  max-height: 766px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  animation-duration: 1s;
  animation-fill-mode: forwards;

  &.modal-transition-enter {
    animation-name: ${slideIn};
  }

  &.modal-transition-exit {
    animation-name: ${slideOut};
  }

  @media only screen and (max-width: 1024px) {
    width: 80%;
  }
  @media only screen and (max-width: 768px) {
    height: ${({height}) => height ? height : 'auto'};
    width: 95%;
  }
  @media only screen and (min-width: 768px) {
    min-width: 600px;
  }
`;