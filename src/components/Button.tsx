import Link from 'next/link'
import React, { FormEvent, MouseEventHandler } from 'react'
import styled from 'styled-components'

export default function Button({text, onClick, width='auto', to, type='button'}: {
  text: string;
  onClick: ()=>void;
  width?: string | undefined;
  to?: string;
  type?: string 
}) {
  
  return (
    <div>
      {
        to ?
        <Link href={to}>
          <Btn onClick={onClick} $width={width} type={'button'} >
            {text}
          </Btn>
        </Link>
        :
        <Btn onClick={onClick} $width={width} type={'button'}>
          {text}
        </Btn>
      }
    </div>
  )
}

const Btn = styled.button <{ $width?: string }>`
    border: 0;
    background-color: #8294C4;
    padding: 10px 25px;
    border-radius: 10px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
    width: ${props=>props.$width ? props.$width : 'auto'};
    margin: 10px;
    cursor: pointer;
    :hover{
        background-color: #637195;
    }
    @media only screen and (max-width: 500px) {
      padding: 5px 15px;
      margin: 5px;
    }
`