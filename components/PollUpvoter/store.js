import { graphql } from "react-apollo";
import upvotePollGql from "./upvotePoll.gql";

const withMutation = graphql(upvotePollGql, {
  props: ({ ownProps, mutate }) => ({
    upvote: (id, votes) =>
      mutate({
        variables: { id, votes },
        optimisticResponse: {
          __typename: "Mutation",
          updatePoll: {
            __typename: "Poll",
            id: ownProps.id,
            votes: ownProps.votes + 1
          }
        }
      })
  })
});

export default comp => withMutation(comp);
