import styled from "styled-components";
import { A } from "../Theme";
import * as T from "../Theme";

// eslint-disable-next-line import/prefer-default-export
export const Section = styled.section`
  padding-bottom: 20px;

  > h1 {
    margin-top: 0;
  }

  > p {
    font-size: 17px;
  }
`;

export const Item = styled.li`
  display: block;
  margin-bottom: 10px;
`;

export const Title = T.A.extend`
  font-size: 14px;
  margin-right: 10px;
  text-decoration: none;
  padding-bottom: 0;
  border: 0;
`;

export const TitleCount = T.A.extend`
  font-size: 18px;
  margin-left: 10px;
  text-decoration: none;
  padding-bottom: 0;
  border: 0;
  color: red
`;

export const Index = styled.span`
  font-size: 14px;
  margin-right: 5px;
`;

export const ItemList = styled.ul`
  margin: 0;
  padding: 0;
`;

export { A };
