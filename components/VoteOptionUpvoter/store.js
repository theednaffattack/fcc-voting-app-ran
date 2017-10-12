import { graphql } from "react-apollo";
import upvoteVoteOptionGql from "./upvoteVoteOption.gql";

const withMutation = graphql(upvoteVoteOptionGql, {
  props: ({ ownProps, mutate }) => ({
    upvote: (id, votes) =>
      mutate({
        variables: { id, votes },
        optimisticResponse: {
          __typename: "Mutation",
          createVote: {
            __typename: "VoteOption",
            id: ownProps.id,
            votes: ownProps.votes + 1
          }
        }
      })
  })
});

export default comp => withMutation(comp);
