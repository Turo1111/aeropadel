// LoadingEllipsis.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const ldsEllipsis1 = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

const ldsEllipsis2 = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(72px, 0); /* Increased by 3x */
  }
`;

const ldsEllipsis3 = keyframes`
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`;

const StyledLoadingEllipsis = styled.div`
  display: inline-block;
  position: relative;
  width: 240px; /* Increased by 3x */
  height: 240px; /* Increased by 3x */

  div {
    box-sizing: border-box;
    position: absolute;
    top: 100px; /* Increased by 3x */
    width: 40px; /* Increased by 3x */
    height: 40px; /* Increased by 3x */
    border-radius: 50%;
    animation-timing-function: cubic-bezier(0, 1, 1, 0);

    &:nth-child(1) {
      left: 24px; /* Increased by 3x */
      background: #41444B;
      animation: ${ldsEllipsis1} 0.6s infinite;
    }

    &:nth-child(2) {
      left: 24px; /* Increased by 3x */
      background: #F6F0F0;
      animation: ${ldsEllipsis2} 0.6s infinite;
    }

    &:nth-child(3) {
      left: 96px; /* Increased by 3x */
      background: #41444B;
      animation: ${ldsEllipsis2} 0.6s infinite;
    }

    &:nth-child(4) {
      left: 168px; /* Increased by 3x */
      background: #F6F0F0;
      animation: ${ldsEllipsis3} 0.6s infinite;
    }
  }

  p {
    margin-top: 180px; /* Adjust margin to position text below the animation */
    text-align: center;
    font-size: 48px; /* Increased by 3x */
    font-weight: bold;
  }

  .golo {
    color: #41444B;
  }

  .zur {
    color: #F6F0F0;
  }
`;

const Loading = () => (
  <StyledLoadingEllipsis>
    <div></div>
    <div></div>
    <div></div>
    <div></div>
    {/* <p><span className="golo">GOLO</span><span className="zur">ZUR</span></p> */}
    <p style={{fontSize: 24, marginTop: 3, color:'#d9d9d9'}}>Cargando datos</p>
  </StyledLoadingEllipsis>
);

export default Loading;
