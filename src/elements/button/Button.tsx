"use client";

import styled from "styled-components";

export const Button = styled.button`
  width: fit-content;
  padding: 3px 10px;
  border: 1px solid black;
  border-radius: 5px;
  transition: all 10ms;

  ${(props) =>
    !props.disabled &&
    `&:hover {
    background-color: black;
    color: white;
  }`}

  :disabled {
    cursor: default;
    opacity: 0.7;
  }
`;
