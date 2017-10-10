/*eslint-disable */
import PropTypes from "prop-types";
import { Link } from "../../routes";
import OptionUpvoter from "../OptionUpvoter";
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

const OptionList = ({
  data: { allOptions, loading, _allOptionsMeta },
  loadMoreOptions
}) => {
  if (allOptions && allOptions.length) {
    // const areMoreOptions = allOptions.length < _allOptionsMeta.count;
    return (
      <Main>
        <ItemList>
          {allOptions.map((option, index) => (
            <Item key={option.id}>
              <div>
                <Index>{index + 1}. </Index>
                <Link
                  route="details"
                  params={{
                    optionId: option.id,
                    optionTitle: option.title
                  }}
                  passHref
                >
                  <Title>{option.title}</Title>
                </Link>
                {option.id}
                <OptionUpvoter id={option.id} votes={option.votes} />
              </div>
            </Item>
          ))}
        </ItemList>
        {/* areMoreOptions ? (
          <ShowMore onClick={() => loadMoreOptions()}>
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

OptionList.propTypes = {
  data: PropTypes.object.isRequired,
  loadMoreOptions: PropTypes.func.isRequired
};

export default connect(OptionList);
/* eslint-enable */
