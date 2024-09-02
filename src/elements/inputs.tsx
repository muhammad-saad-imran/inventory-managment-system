"use client";

import styled from "styled-components";

export const InputBase = styled.input`
  width: 100%;

  &:focus {
    outline: none;
    border-bottom: 1px solid gray;
  }
`;

export const Input = styled(InputBase)`
  border: 1px solid gray;
  padding: 6px 10px;
  border-radius: 6px;

  &:focus {
    outline: auto;
  }
`;
