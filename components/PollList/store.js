import { graphql } from 'react-apollo';
import allPollsGql from './allPolls.gql';

const POLLS_PER_PAGE = 10;

const withData = graphql(allPollsGql, {
  options: () => ({
    variables: {
      skip: 0,
      first: POLLS_PER_PAGE
    }
  }),
  props: ({ data }) => ({
    data,
    loadMorePolls: () =>
      data.fetchMore({
        variables: {
          skip: data.allPolls.length
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }
          return Object.assign({}, previousResult, {
            // Append the new posts results to the old one
            allPolls: [...previousResult.allPolls, ...fetchMoreResult.allPolls]
          });
        }
      })
  })
});

export default comp => withData(comp);
