
import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';


type TypeInput = 'text' | 'number' | 'email' | 'date' | 'password';

const InputWrapper = styled.div<{width: string}>`
  position: relative;
  margin: 15px 0;
  width: ${({width})=>width !== '' ? width : '-webkit-fill-available'};
  text-align: center;
  display: flex;
  flex-direction: column;
`;

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

const Prefix = styled.div`
  position: absolute;
  top: 8px;
  left: 10px;
  font-size: 16px;
  color: ${props => props.color};
  display: flex;
  align-items: center;
`;

const InputField = styled.input<{ $focused?: boolean; $hasPrefix?: boolean; }>`
  height: 35px;
  padding: 5px 10px;
  font-size: 16px;
  color: ${props => props.color};
  border-radius: 10px;
  border: ${({ $focused }) => ($focused ? '2px solid #7286D3' : '1px solid #d9d9d9')};
  transition: border-color 0.2s ease-in-out;
  padding-left: ${({ $hasPrefix }) => ($hasPrefix ? '30px' : '10px')};

  &:focus {
    outline: none;
  }
`;

const Input = ({ type, label, value, onChange, name, required, readOnly, prefix, width='' }: {
  type: TypeInput,
  label: string,
  value: any,
  onChange: (e: ChangeEvent<HTMLInputElement>)=>void,
  name: string,
  required?: boolean,
  readOnly?: boolean,
  prefix?: string,
  width?: string
}) => {
  const [isActive, setIsActive] = useState<boolean>(type === 'date' ? true : false);
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const handleInputFocus = () => {
    setIsActive(true);
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsActive(value !== '');
    setIsFocused(false);
  };

  useEffect(() => {
    if (value === '') {
      setIsActive(false);
      setIsFocused(false);
    } else {
      setIsActive(true);
      setIsFocused(true);
    }
  }, [value]);

  return (
    <InputWrapper width={width}>
      {prefix && <Prefix color={'#716A6A'}>{prefix}</Prefix>}
      <InputLabel $active={isActive} color={process.env.TEXT_COLOR}>
        {label}
        {required && ' - Campo requerido'}
      </InputLabel>
      <InputField
        color={process.env.TEXT_COLOR}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        $focused={isFocused}
        readOnly={readOnly}
        $hasPrefix={prefix !== ''}
      />
    </InputWrapper>
  );
};

export default Input;
