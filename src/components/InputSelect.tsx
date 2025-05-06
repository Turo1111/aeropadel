/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';// Usar react-icons para íconos
import apiClient from '../utils/client';
import { useAppDispatch, useAppSelector } from '../redux/hook';

import {IoIosArrowDown} from 'react-icons/io'
import useLocalStorage from '@/hooks/useLocalStorage';

interface Item {
  _id: string;
  name: string;
}

interface InputSelectProps {
  value: string;
  onChange: (id: string, item: any) => void;
  name: string;
  path: string;
  label: string;
}

const InputSelect: React.FC<InputSelectProps> = ({ value, onChange, name, path, label }) => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Item[]>([]);
  const [inputValue, setInputValue] = useState(value);
  const [isActive, setIsActive] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const dispatch = useAppDispatch();

  const getData = () => {
    setLoading(true);
    apiClient.get(`${path}`)
      .then(response => {
        console.log('response input select', response)
        setData(response.data);
        setLoading(false);
      })
      .catch(e => console.log(e));
  };

  const addValue = (item: Item) => {
    onChange(item._id, item);
    setInputValue(item.name);
    setOpen(false);
    setIsActive(true);
    setIsFocused(true);
  };

  const cleanValue = () => {
    onChange('', '' );
    setInputValue('');
    setIsActive(false);
    setIsFocused(false);
  };

  const handleInputFocus = () => {
    setIsActive(true);
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsActive(inputValue !== '');
    setIsFocused(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    getData();
  }, [path]);

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

  useEffect(() => {
    if (inputValue !== '') {
      setOpen(false);
    }
  }, [inputValue]);

  return (
    <Container>
      <StyledInput
        placeholder={label}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      {
        inputValue === ''
          ? (
            <ArrowContainer onClick={() => setOpen(!open)}>
              <IoIosArrowDown />
            </ArrowContainer>
          )
          : (
            loading2
              ? <LoadingText>Cargando...</LoadingText>
              : (
                <ActionContainer>
                  <ActionText onClick={cleanValue}>Quitar</ActionText>
                </ActionContainer>
              )
          )
      }
      <Dropdown open={open}>
        <ScrollContainer>
          {
            loading
              ? <LoadingText>Cargando...</LoadingText>
              : data.length === 0
                ? <LoadingText>Lista Vacía</LoadingText>
                : data.map(item => (
                  <ItemContainer key={item._id} onClick={() => addValue(item)}>
                    <ItemText>{item.name}</ItemText>
                  </ItemContainer>
                ))
          }
        </ScrollContainer>
      </Dropdown>
    </Container>
  );
};

export default InputSelect;

// Styled Components
const Container = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  margin: 10px 0;
  border: 1px solid #D9D9D9;
  padding: 5px 15px;
  border-radius: 10px;
  color: #7F8487;
  font-size: 14px;
  background-color: #fff;
  width: 100%;
  height: 35px;
`;

const ArrowContainer = styled.div`
  position: absolute;
  right: 15px;
  top: 18px;
  cursor: pointer;
`;

const ActionContainer = styled.div`
  position: absolute;
  right: 5px;
  top: 10px;
  display: flex;
  flex-direction: row;
`;

const ActionText = styled.span`
  font-size: 16px;
  color: #7F8487;
  margin: 5px 15px;
  cursor: pointer;
`;

const Dropdown = styled.div<{ open: boolean }>`
  position: absolute;
  max-height: 150px;
  background-color: #fff;
  width: 100%;
  top: 40px;
  z-index: 15;
  display: ${props => (props.open ? 'block' : 'none')};
  overflow: auto;
`;

const ScrollContainer = styled.div`
  max-height: 150px;
  overflow-y: auto;
`;

const LoadingText = styled.p`
  font-size: 16px;
  color: #7F8487;
  margin: 5px 15px;
`;

const ItemContainer = styled.div`
  padding: 5px 15px;
  cursor: pointer;
`;

const ItemText = styled.p`
  font-size: 16px;
  color: #7F8487;
  margin: 5px 0;
`;
