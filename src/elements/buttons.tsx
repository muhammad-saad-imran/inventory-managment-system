"use client";

import styled from "styled-components";

export const Button = styled.button`
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
`;

// Secondary Button style
export const SecondaryButton = styled(Button)`
  background-color: black;
  color: white;
  border-color: black;
`;
