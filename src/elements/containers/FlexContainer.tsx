import styled from "styled-components";

type Props = {
  $justifyContent?: string;
  $alignItems?: string;
  $height?: string;
  $width?: string;
};

export const FlexContainer = styled.div<Props>`
  height: ${({ $height }) => $height || "100%"};
  width: ${({ $width }) => $width || "100%"};
  display: flex;
  justify-content: ${({ $justifyContent }) => $justifyContent || "center"};
  align-items: ${({ $alignItems }) => $alignItems || "center"};
`;
