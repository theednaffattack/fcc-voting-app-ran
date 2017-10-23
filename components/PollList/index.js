/*eslint-disable */
import PropTypes from "prop-types";
import { Link } from "../../routes";
import {
  Main,
  ItemList,
  Item,
  Index,
  Title,
  ShowMore,
  Loading
} from "./styles";
import connect from "./store";

const PollList = ({
  data: { allPolls, loading, _allPollsMeta },
  loadMorePolls
}) => {
  if (allPolls && allPolls.length) {
    // const areMorePolls = allPolls.length < _allPollsMeta.count;
    return (
      <Main>
        <ItemList>
          {allPolls.map((poll, index) => (
            <Item key={poll.id}>
              <div>
                <Index>{index + 1}. </Index>
                <Link
                  route="details"
                  params={{
                    pollId: poll.id,
                    pollTitle: poll.title
                  }}
                  passHref
                >
                  <Title>{poll.title}</Title>
                </Link>
              </div>
            </Item>
          ))}
        </ItemList>
        {/* areMorePolls ? (
          <ShowMore onClick={() => loadMorePolls()}>
            {loading ? "Loading..." : "Show More"}
          </ShowMore>
        ) : (
          ""
        ) */}
      </Main>
    );
  }
  return <Loading>Loading</Loading>;
};

PollList.propTypes = {
  data: PropTypes.object.isRequired,
  loadMorePolls: PropTypes.func.isRequired
};

export default connect(PollList);
/* eslint-enable */
