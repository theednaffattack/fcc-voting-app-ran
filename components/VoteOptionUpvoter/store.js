import { graphql } from "react-apollo";
import createVoteGql from "./createVote.gql";

const withMutation = graphql(createVoteGql, {
  props: ({ mutate }) => ({
    upvote: voteOption =>
      mutate({
        variables: { voteOption }
      })
  })
});

export default comp => withMutation(comp);
