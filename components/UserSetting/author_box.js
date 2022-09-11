import { Upload } from "antd";
import FeatherIcon from "feather-icons-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, NavLink } from "react-router-dom";
import { changeProfileActiveMenu } from "../../redux/layout/ActionCreator";
import { getUserProfile, updateUserAvatar } from "../../requests/profile";
import alertContainer from "../../utils/Alert";
import { Cards } from "../cards/frame/cards-frame";
import { ProfileAuthorBox } from "./styled";

const AuthorBox = () => {
  const dispatch = useDispatch();

  const navItems = [
    {
      id: 1,
      title: "Editar Perfil",
      key: "edit_profile",
      route: "profile",
      icon: "user",
    },
    {
      id: 2,
      title: "Cuenta",
      key: "account_settings",
      route: "account",
      icon: "settings",
    },
    // {
    //   id: 3,
    //   title: "Cambiar Contraseña",
    //   key: "change_password",
    //   route: "password",
    //   icon: "key",
    // },
    {
      id: 4,
      title: "Notificaciones",
      key: "notification",
      route: "notification",
      icon: "bell",
    },
  ];

  const INITIAL_STATE = {
    first_name: "",
    last_name: "",
    second_first_name: "",
    second_last_name: "",
  };

  const [currentTab, setCurrentTab] = useState(1);
  const [profileData, setProfileData] = useState(INITIAL_STATE);

  const { currentProfileTab, currentUser } = useSelector((state) => {
    return {
      currentProfileTab: state.ChangeLayoutMode.profileCurrentTab,
      currentUser: state.auth.currentUser,
    };
  });

  const selectedTab = (id) => {
    dispatch(changeProfileActiveMenu(id));
  };

  useEffect(() => {
    setCurrentTab(currentProfileTab);
  });

  const fetchProfile = () => {
    if (currentUser.userDetails) {
      let user = JSON.parse(currentUser.userDetails);
      setProfileData(user);
    } else {
      fetchProfileDetails();
    }
  };

  const fetchProfileDetails = () => {
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
  };

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchProfile();
    }

    return () => (mounted = false);
  }, []);

  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  const handleChange = (info) => {
    if (info.file.status === "done") {
      let data = new FormData();
      data.append("user[avatar]", info.file.originFileObj);
      updateUserAvatar(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        data
      ).then((response) => {
        if (response.status === 200) {
          alertContainer({
            title: response.data.message,
            text: "",
            icon: "success",
            showConfirmButton: false,
          });
          fetchProfile();
        }
      });
    }
  };

  return (
    <ProfileAuthorBox>
      <Cards headless>
        <div className="author-info">
          <figure>
            <img src={profileData.avatar_url} alt="" />

            <Upload onChange={handleChange} showUploadList={false}>
              <Link to="#">
                <FeatherIcon icon="camera" size={16} />
              </Link>
            </Upload>
          </figure>
          <figcaption>
            <div className="info">
              {/* <Heading as="h4" >Duran Clayton</Heading> */}
              <h4>
                {profileData.first_name} {profileData.last_name}
              </h4>
            </div>
          </figcaption>
        </div>
        <nav className="settings-menmulist">
          <ul>
            {navItems.map((item) => {
              if (item.key == "change_password") {
                return (
                  <li key={item.key}>
                    <NavLink
                      to="#"
                      activeClassName={
                        currentProfileTab == item.id ? "active" : ""
                      }
                      onClick={() => {
                        selectedTab(item.id);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-key"
                      >
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                      </svg>
                      {item.title}
                    </NavLink>
                  </li>
                );
              } else {
                return (
                  <li key={item.key}>
                    <NavLink
                      to="#"
                      activeClassName={currentTab == item.id ? "active" : ""}
                      onClick={() => {
                        selectedTab(item.id);
                      }}
                    >
                      <FeatherIcon icon={item.icon} size={14} />
                      {item.title}
                    </NavLink>
                  </li>
                );
              }
            })}
          </ul>
        </nav>
      </Cards>
    </ProfileAuthorBox>
  );
};

export default AuthorBox;
