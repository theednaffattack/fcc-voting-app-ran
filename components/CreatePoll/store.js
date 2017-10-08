import { graphql } from 'react-apollo';
import createPollGql from './createPoll.gql';

export const withMutation = graphql(createPollGql, {
  props: ({ mutate }) => ({
    mutations: {
      createPoll: (title, url) =>
        mutate({
          variables: { title, url },
          updateQueries: {
            allPolls: (previousResult, { mutationResult }) => {
              const newPoll = mutationResult.data.createPoll;
              return Object.assign({}, previousResult, {
                // Append the new poll
                allPolls: [newPoll, ...previousResult.allPolls]
              });
            }
          }
        })
    }
  })
});

export default comp => withMutation(comp);
