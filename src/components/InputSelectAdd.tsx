/* eslint-disable react-hooks/exhaustive-deps */
import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';
import {IoIosArrowDown} from 'react-icons/io'
import apiClient from '@/utils/client';
import { ObjectId } from 'mongoose';
const io = require('socket.io-client')

type TypeInput = 'text' | 'number' | 'email' | 'date' | 'password';

const InputWrapper = styled.div`
  position: relative;
  margin: 15px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: 1440px) {
    margin: 20px 0;
  }
`;

interface InputLabelProps {
  color: string;
  $active: boolean;
}

const InputLabel = styled.label<{ $active?: boolean }>`
  position: absolute;
  top: 10px;
  left: 15px;
  font-size: 14px;
  color: ${props => props.color};
  transition: transform 0.2s ease-in-out;
  transform-origin: top left;
  pointer-events: none;
  
  ${({ $active }) =>
    $active &&
    `
    transform: translateY(-25px) scale(0.8);
  `}
`;

interface InputFieldProps {
  color: string;
  $focused: boolean;
}

const InputField = styled.input<InputFieldProps>`
  height: 35px;
  padding: 5px 10px;
  font-size: 16px;
  color: ${props => props.color};
  border-radius: 10px;
  border: ${({ $focused}) => ($focused ? '2px solid #7286D3' : '1px solid #d9d9d9')};
  transition: border-color 0.2s ease-in-out;

  &:focus {
    outline: none;
  }
`;

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: ${props => props.color};
    padding: 14px 0;
    cursor: pointer;
`
const Tag = styled.label `
    font-size: 16px;
    padding: 0 15px;
    color: ${props=>props.color};
    cursor: pointer;
`

const ItemModal = styled.li `
    font-size: 16px;
    padding: 5px 15px;
    color: ${props=>props.color};
    cursor: pointer;
    list-style: none;
    :hover{
        background-color: #F9F5F6;
    }
`

const Modal = styled.ul`
    position: absolute; 
    width: 100%; 
    min-height: 30px;
    max-height: 150px;
    overflow-y: scroll;
    background-color: #fff; 
    top: 40px;
    z-index: 2;
    /* box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25); */
    border: 1px solid #d9d9d9;
    border-top: 0;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    margin: 0;
    padding: 0;
`

const LoadingText = styled.p`
  margin-top: 10px;
  font-size: 16px;
  color: #8294C4;
`;

const InputSelectAdd = ({type = 'text', label, value, onChange, name, edit = false, path, idSelect}: 
  {
    type: TypeInput, label: string, value: any, 
    onChange: (id:any, item:any)=>void, name: string, 
    edit?: boolean, path: string, idSelect?: (string | ObjectId)
  }

) => {
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [openList, setOpenList] = useState(false)
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const token = process.env.NEXT_PUBLIC_TOKEN

  const [inputValue, setInputValue] = useState(value)

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputFocus = () => {
    setIsActive(true);
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsActive(inputValue !== '');
    setIsFocused(false);
  };

  const addValue = (item: any) => {
    onChange(item._id, item)
    setInputValue(item.name)
    setOpenList(false)
    setIsActive(true);
    setIsFocused(true);
  }

  const cleanValue = () => {
    onChange('', '')
    setInputValue('')
    setIsActive(false);
    setIsFocused(false);
  }

  const postValue = () => {
    setLoading2(true)
    apiClient.post(`/${path}`, {name: inputValue},
    {
      headers: {
        Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
      }
    })
    .then((r)=>{
      onChange(r.data._id, r.data)
      setLoading2(false)
    })
    .catch(e=>{
      setLoading2(false)
    })
  }

  const patchValue = () => {
    if (idSelect) {
      setLoading2(true)
      apiClient.patch(`/${path}/${idSelect}`, {_id: idSelect, name: inputValue},
      {
        headers: {
          Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
        }
      })
      .then((r)=>{
        onChange(r.data._id, r.data)
        setLoading2(false)
      })
      .catch(e=>{
        setLoading2(false)
      })
    }
  }

  useEffect(()=>{
    setLoading(true)
    apiClient.get(`/${path}`,
    {
      headers: {
        Authorization: `Bearer ${token}` // Agregar el token en el encabezado como "Bearer {token}"
      }
    })
    .then((r)=>{
      setLoading(false)
      setData(r.data) 
    })
    .catch(e=>console.log('error', e))
  },[token])

  useEffect(()=>{
    const socket = io(process.env.NEXT_PUBLIC_DB_HOST)
    socket.on(`${path}`, (socket: any) => {
      setData((prevData: any[])=>{
        if (!Array.isArray(prevData)) {
          return [socket.data]
        }
        const exist = prevData.find((elem: any) => elem._id === socket.data._id )
        if (exist) {
          return prevData.map((item: any) =>
            item._id === socket.data._id ? socket.data : item
          )
        }
        return [...prevData, socket.data]
      }) 
    })
    return () => {
      socket.disconnect();
    }; 
  },[data]) 

  useEffect(()=>{
    if (value === '' || value === undefined) {
      setInputValue('')
      setIsActive(false);
      setIsFocused(false);
    }else {
      setInputValue((prevData: string)=>value)
      setIsActive(true);
      setIsFocused(true);
    }
  },[value])

  useEffect(()=>{
    if (inputValue !== '') {
      setOpenList(false)
    }
  },[inputValue])

  return (
    <InputWrapper>
      <InputLabel $active={isActive} color={'#716A6A'} >{type === 'date' ? '' : label}</InputLabel>
      <InputField
        color={'#716A6A'}
        type={type}
        value={inputValue} 
        onChange={handleInputChange}
        name={name}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}    
        $focused={isFocused}
      />
      {
        inputValue === '' ?  
        <div style={{display: 'flex', position: 'absolute', right: 15, top: -5}}>
          <IconWrapper color={'#716A6A'} onClick={()=>setOpenList(!openList)}>
            <IoIosArrowDown/>
          </IconWrapper>
        </div>                              
        :
         (value === '' || value === undefined ) ? 
          <div style={{display: 'flex', position: 'absolute', right: 0, top: -5}}>
            {
              loading2 ?
              <IconWrapper>
                <Tag color={'#716A6A'}>Cargando..</Tag>
              </IconWrapper>
              :
              <IconWrapper onClick={postValue}>
                  <Tag color={'#716A6A'}>Agregar</Tag>
              </IconWrapper>
            }
          </div>
          :
          <div style={{display: 'flex', position: 'absolute', right: 0, top: -5}}>
            {
              loading2 ?
              <IconWrapper>
                <Tag color={'#716A6A'}>Cargando..</Tag>
              </IconWrapper>
              :
              <>
                <IconWrapper onClick={patchValue}>
                  <Tag color={'#716A6A'}>Modificar</Tag>
                </IconWrapper>
                <IconWrapper onClick={cleanValue}>
                    <Tag color={'#716A6A'}>Quitar</Tag>
                </IconWrapper>
              </>
            }
            
          </div>
      }
      {
        openList && 
        <Modal>
          {
            loading ? 
              <LoadingText>Cargando...</LoadingText>
            :
            <>
              {
                  data.length === 0 ? 'Vacio' : 
                  data.map((item:any, index)=> <ItemModal key={index} color={process.env.TEXT_COLOR} onClick={()=>addValue(item)} >{item.name}</ItemModal>)
              }
            </>
          }
        </Modal>
      }
    </InputWrapper>
  );
};

export default InputSelectAdd;