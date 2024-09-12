"use client";

import styled from "styled-components";

export const InputBase = styled.input`
  width: 100%;
  border-bottom: 0.5px solid gray;
  background-color: white;

  &:focus {
    outline: none;
    border-bottom: 1px solid gray;
  }
`;

export const Input = styled(InputBase)`
  border: 0.5px solid gray;
  padding: 6px 10px;
  border-radius: 4px;

  &:focus {
    outline: none;
    border: 2px solid #007bff;
  }
`;

export const SelectBase = styled.select`
  width: 100%;
  border-bottom: 0.5px solid gray;
  background-color: white;
  padding: 6px 10px;
  border-radius: 4px;
  appearance: none; /* Removes the default arrow icon */
  background-image: url("/drop-down.svg");
  background-repeat: no-repeat;
  background-position: right 10px center;

  &:focus {
    outline: none;
    border-bottom: 1px solid gray;
  }
`;

export const Select = styled(SelectBase)`
  border: 0.5px solid gray;
  padding: 6px 10px;
  border-radius: 4px;

  &:focus {
    outline: none;
    border: 2px solid #007bff;
  }
`;
