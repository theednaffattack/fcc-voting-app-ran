/*eslint-disable */
import PropTypes from "prop-types"; // eslint disable prettier/prettier
import { Link } from "../../routes"; // eslint disable prettier/prettier
import { A, LogOutButton } from "./styles"; // eslint disable prettier/prettier

const LinkList = ({ pathname, authenticated, logout }) => (
  <nav>
    <Link prefetch href="/" passHref>
      <A active={pathname === "/"}>Main Page</A>
    </Link>
    <Link prefetch route="create" passHref>
      <A active={pathname === "/create"}>Create</A>
    </Link>
    <Link prefetch route="poll" passHref>
      <A active={pathname === "/poll"}>Polls</A>
    </Link>
    {!authenticated && (
      <Link prefetch route="signin" passHref>
        <A active={pathname === "/sign_in"}>SignIn</A>
      </Link>
    )}
    {!authenticated && (
      <Link prefetch route="signup" passHref>
        <A active={pathname === "/sign_up"}>SignUp</A>
      </Link>
    )}
    {authenticated && (
      <Link prefetch route="mypolls" passHref>
        <A active={pathname === "/my_polls"}>MyPolls</A>
      </Link>
    )}
    {authenticated && (
      <LogOutButton
        role="link"
        href="#"
        onClick={() => logout()}
        active={pathname === "/sign_up"}
      >
        LogOut
      </LogOutButton>
    )}
    <A
      href="https://github.com/Sly777/ran"
      rel="noopener noreferrer"
      target="_blank"
    >
      RAN! @ Github
    </A>
  </nav>
);

LinkList.propTypes = {
  pathname: PropTypes.string.isRequired,
  authenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
};
/* eslint-enable */

export default LinkList;
