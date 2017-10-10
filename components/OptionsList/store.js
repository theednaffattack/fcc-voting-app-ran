import { graphql } from "react-apollo";
import allOptionsGql from "./allOptions.gql";

const OPTIONS_PER_PAGE = 10;

const withData = graphql(allOptionsGql, {
  options: () => ({
    variables: {
      skip: 0,
      first: OPTIONS_PER_PAGE
    }
  }),
  props: ({ data }) => ({
    data,
    loadMoreOptions: () =>
      data.fetchMore({
        variables: {
          skip: data.allOptions.length
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            // Append the new posts results to the old one
            allOptions: [
              ...previousResult.allOptions,
              ...fetchMoreResult.allOptions
            ]
          });
        }
      })
  })
});

export default comp => withData(comp);
