import { Avatar } from "antd";
import FeatherIcon from "feather-icons-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { InfoWraper, NavAuth, UserDropDwon } from "./auth-info-style";
// import Message from './message/message';
// import Notification from './notification/notification';
// import Settings from './settings';
// import Support from './support';
import { Popover } from "../../popup/popup";
// import { Dropdown } from '../../dropdown/dropdown';
import { Spinner } from "reactstrap";
import { changeProfileActiveMenu } from "../../../redux/layout/ActionCreator";
import { logout } from "../../../redux/user/Action";
import { signOut } from "../../../requests/authentication";
import alertContainer from "../../../utils/Alert";
import Heading from "../../heading/heading";
// import Notification from './notification';
import dynamic from "next/dynamic";
import { getUserProfile } from "../../../requests/profile";

const INITIAL_STATE = {
  first_name: "",
  last_name: "",
  second_first_name: "",
  second_last_name: "",
  avatar_url: "",
};

const AuthInfo = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [state, setState] = useState({
    flag: "english",
  });
  const { flag } = state;
  const [spinner, setSpinner] = useState(false);
  const [profileData, setProfileData] = useState(INITIAL_STATE);

  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const handleNavigation = (url, id) => {
    router.push(url);
    dispatch(changeProfileActiveMenu(id));
  };

  const fetchProfile = () => {
    if (currentUser.userDetails) {
      let user = JSON.parse(currentUser.userDetails);
      setProfileData(user);
    } else {
      getUserProfile(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client
      ).then((response) => {
        if (response.status === 200) {
          let output = response.data.data;
          setProfileData({
            first_name: output.first_name,
            last_name: output.last_name,
            second_first_name: output.second_first_name,
            second_last_name: output.second_last_name,
            avatar_url: output.avatar_url,
          });
        }
      });
    }
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      setEmail(currentUser.uid);
      fetchProfile();
    }

    return () => (mounted = false);
  }, []);

  const SignOut = (e) => {
    e.preventDefault();
    setSpinner(true);
    signOut(currentUser.client, currentUser.accessToken, currentUser.uid).then(
      (response) => {
        setSpinner(false);
        if (response.status === 200 && response.data.success) {
          alertContainer({
            title: "Cierre de sesión exitoso",
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          dispatch(logout());
        }
      },
      (error) => {
        const data = error.response.data;
        setSpinner(false);
      }
    );
  };

  const userContent = (
    <UserDropDwon>
      <div className="user-dropdwon">
        <figure className="user-dropdwon__info">
          {/* <img src='/img/avatar/chat-auth.png' alt="image" /> */}
          <figcaption>
            <Heading as="h5">
              {profileData.first_name} {profileData.last_name}
            </Heading>
            <p>{email}</p>
          </figcaption>
        </figure>
        <ul className="user-dropdwon__links">
          <li>
            <Link
              to="/settings"
              onClick={() => handleNavigation("/settings", 1)}
            >
              <FeatherIcon icon="user" /> Perfil
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              onClick={() => handleNavigation("/settings", 2)}
            >
              <FeatherIcon icon="settings" /> Cuenta
            </Link>
          </li>
          <li>
            <Link to="#">
              <FeatherIcon icon="credit-card" /> Tarjetas
            </Link>
          </li>
          {/* <li>
            <Link to="#">
              <FeatherIcon icon="users" /> Activity
            </Link>
          </li> */}
          {/* <li>
            <Link to="#">
              <FeatherIcon icon="bell" /> Help
            </Link>
          </li> */}
        </ul>
        <Link
          className="user-dropdwon__bottomAction"
          disabled={spinner}
          onClick={SignOut}
          to="#"
        >
          {spinner ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              style={{ marginRight: "5px" }}
            ></Spinner>
          ) : (
            <FeatherIcon icon="log-out" />
          )}{" "}
          Salir
        </Link>
      </div>
    </UserDropDwon>
  );

  const onFlagChangeHandle = (value) => {
    setState({
      ...state,
      flag: value,
    });
  };

  const NotificationWithoutSSR = dynamic(() => import("./notification"), {
    ssr: false,
  });

  const country = (
    <NavAuth>
      <Link onClick={() => onFlagChangeHandle("english")} to="#">
        <img src="/img/flag/english.png" alt="image" />
        <span>English</span>
      </Link>
      <Link onClick={() => onFlagChangeHandle("germany")} to="#">
        <img src="/img/flag/germany.png" alt="image" />
        <span>Germany</span>
      </Link>
      <Link onClick={() => onFlagChangeHandle("spain")} to="#">
        <img src="/img/flag/spain.png" alt="image" />
        <span>Spain</span>
      </Link>
      <Link onClick={() => onFlagChangeHandle("turky")} to="#">
        <img src="/img/flag/turky.png" alt="image" />
        <span>Turky</span>
      </Link>
    </NavAuth>
  );

  return (
    <InfoWraper>
      <NotificationWithoutSSR />
      <div className="nav-author">
        <Popover placement="bottomRight" content={userContent} action="click">
          <Link to="#" className="head-example">
            <Avatar src={profileData.avatar_url} />
          </Link>
        </Popover>
      </div>
    </InfoWraper>
  );
};

export default AuthInfo;
