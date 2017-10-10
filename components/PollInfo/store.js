import { graphql } from "react-apollo";
import getPollGql from "./getPoll.gql";

const withData = graphql(getPollGql, {
  options: ({ pollId }) => ({
    variables: {
      pollId
    }
  }),
  props: ({ data: { loading, Poll, error } }) => ({
    loading,
    Poll,
    error
  })
});

export default comp => withData(comp);
