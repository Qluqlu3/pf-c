import React from 'react';
import styled from 'styled-components';
import { Color } from 'util/Color';

const CheckBox = styled.div<{ checked: boolean; fill: string }>`
  display: flex;
  width: 18px;
  height: 18px;
  margin-right: 4px;
  background-color: ${({ checked, fill }) => (checked && fill ? fill : Color.gray100)};
  border: 1px solid ${Color.gray700};
  border-radius: 4px;
  cursor: pointer;
`;

const Label = styled.label`
  color: ${Color.gray800};
  cursor: pointer;
`;

const CheckboxContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 4px;

  &:hover {
    ${CheckBox} {
      border-color: ${Color.gray500};
    }
    ${Label} {
      color: ${Color.gray500};
    }
  }
`;

interface Props {
  label: string;
  checked: boolean;
  fill?: string;
  onClickCheckbox: () => void;
}

export const Checkbox: React.FC<Props> = ({ label, checked, fill = Color.main, onClickCheckbox }) => {
  return (
    <CheckboxContent onClick={onClickCheckbox}>
      <CheckBox checked={checked} fill={fill} />
      <Label>{label}</Label>
    </CheckboxContent>
  );
};
