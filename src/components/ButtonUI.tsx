import Link from 'next/link';
import React from 'react';
import styled, { css } from 'styled-components';

const PushableButton = styled.button<{$isActive: boolean}>`
  position: relative;
  background: transparent;
  padding: 0;
  border: none;
  cursor: pointer;
  outline-offset: 4px;
  outline-color: deeppink;
  transition: filter 250ms;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  margin: 0 5px;
  filter: ${({$isActive})=>$isActive && css`brightness(110%)`};
  width: 100%;
 /*  min-width: 82px;
  max-width: 200px; */
  .front {
    transform:  ${({$isActive})=>$isActive && css`translateY(-6px)`};
    transition: ${({$isActive})=>$isActive && css`transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5)`};
  }

  .shadow {
    transform: ${({$isActive})=>$isActive && css`translateY(4px)`};
    transition: ${({$isActive})=>$isActive && css`transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5)`};
  }
  &:hover {
    filter: brightness(110%);
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }

  &:active .front {
    transform: translateY(-2px);
    transition: transform 34ms;
  }

  &:active .shadow {
    transform: translateY(1px);
    transition: transform 34ms;
  }

  &:hover .front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }

  &:hover .shadow {
    transform: translateY(4px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }
`;

const Shadow = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: hsl(226, 25%, 69%);
  border-radius: 8px;
  filter: blur(2px);
  will-change: transform;
  transform: translateY(2px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
`;

const Edge = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  border-radius: 8px;
  background: linear-gradient(
    to right,
    hsl(248, 39%, 39%) 0%,
    hsl(248, 39%, 49%) 8%,
    hsl(248, 39%, 39%) 92%,
    hsl(248, 39%, 29%) 100%
  );
`;

const Front = styled.span`
  display: block;
  position: relative;
  border-radius: 8px;
  background: hsl(248, 53%, 58%);
  padding: 8px 16px;
  color: white;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-size: 0.8rem;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 0.7rem;
  }
  @media (max-width: 600px) {
    padding: 6px 12px;
    font-size: 0.6rem;
  }
  @media (max-width: 480px) {
    padding: 4px 8px;
    font-size: 0.6rem;
  }
`;

const ButtonUI = ({label = 'ACEPTAR', onClick, to, isActive = false}:{ label : string, onClick: ()=>void, to?: string, isActive?: boolean}) => {
  return (
    <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}} >
      {
        to ?
        <Link href={to} >
          <PushableButton onClick={onClick} $isActive={isActive}>
            <Shadow className="shadow" />
            <Edge className="edge" />
            <Front className="front">{label}</Front>
          </PushableButton>
        </Link>
        :
        <PushableButton onClick={onClick} $isActive={isActive}>
          <Shadow className="shadow" />
          <Edge className="edge" />
          <Front className="front">{label}</Front>
        </PushableButton>
      }
    </div>
  );
};

export default ButtonUI;

const ContainerButton = styled.div `
  min-width: 82px; 
  max-width: 200px;
  @media only screen and (max-width: 500px) {
    min-width: auto; 
  }
`

