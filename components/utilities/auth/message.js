import { Badge } from "antd";
import FeatherIcon from "feather-icons-react";
import Image from "next/image";
import Router from "next/router";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import noPathPic from "../../../public/img/avatar/NoPath.png";
import { readEmailNotificationList } from "../../../redux/email_notification/ActionCreator";
import { setMarkAsRead } from "../../../requests/notification";
import Heading from "../../heading/heading";
import { Popover } from "../../popup/popup";
import { AtbdTopDropdwon } from "./auth-info-style";

const MessageBox = () => {
  const [email_notification_dot, setNotificationDot] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [unread_email_notification_count, setUnreadNotificationCount] =
    useState(0);
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const dispatch = useDispatch();
  const email_notification = useSelector(
    (state) => state.email_notification.data
  );

  useEffect(() => {
    if (readEmailNotificationList) {
      dispatch(readEmailNotificationList(currentUser));
    }
  }, [dispatch]);

  useEffect(() => {
    handleNotificationCount();
  });

  const { rtl } = useSelector((state) => {
    return {
      rtl: state.ChangeLayoutMode.rtlData,
    };
  });

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: "#F1F2F6",
    };
    return <div style={{ ...style, ...thumbStyle }} props={props} />;
  };

  const renderTrackVertical = () => {
    const thumbStyle = {
      position: "absolute",
      width: "6px",
      transition: "opacity 200ms ease 0s",
      opacity: 0,
      [rtl ? "left" : "right"]: "2px",
      bottom: "2px",
      top: "2px",
      borderRadius: "3px",
    };
    return <div className="hello" style={thumbStyle} />;
  };

  const renderView = ({ style, ...props }) => {
    const customStyle = {
      marginRight: rtl && "auto",
      [rtl ? "marginLeft" : "marginRight"]: "-17px",
    };
    return <div {...props} style={{ ...style, ...customStyle }} />;
  };

  renderThumb.propTypes = {
    style: PropTypes.shape(PropTypes.object),
  };

  renderView.propTypes = {
    style: PropTypes.shape(PropTypes.object),
  };

  const getRedirectUrl = (resource_type) => {
    switch (resource_type) {
      case "User":
        return "/moving-note/figuras/";
      default:
        return "/";
    }
  };

  const handleNotificationCount = () => {
    let count = 0;
    let show_notification_dot = false;
    email_notification.map((item) => {
      if (!item.mark_as_read) {
        show_notification_dot = true;
        count = count + 1;
      }
    });
    setNotificationDot(show_notification_dot);
    setUnreadNotificationCount(count);
  };

  const onNotificationClick = (url, id, mark_as_read) => {
    Router.push(url);
    if (!mark_as_read) {
      setSpinner(true);
      setMarkAsRead(
        currentUser.accessToken,
        currentUser.uid,
        currentUser.client,
        id
      ).then(
        (response) => {
          setSpinner(false);
          dispatch(readEmailNotificationList(currentUser));
        },
        (error) => {
          setSpinner(false);
        }
      );
    }
  };

  const content = (
    <AtbdTopDropdwon className="atbd-top-dropdwon">
      <Heading className="atbd-top-dropdwon__title" as="h5">
        <span className="title-text">Messages</span>
        <Badge
          className="badge-success"
          count={unread_email_notification_count}
        />
      </Heading>
      <Scrollbars
        autoHeight
        autoHide
        renderThumbVertical={renderThumb}
        renderView={renderView}
        renderTrackVertical={renderTrackVertical}
      >
        <div className="atbd-top-dropdwon-menu">
          <ul className="atbd-top-dropdwon__nav">
            {email_notification.map((item) => {
              const {
                from,
                resource_type,
                distance_of_time_in_words,
                mark_as_read,
                id,
              } = item;
              return (
                <li key={id}>
                  <Link
                    to={getRedirectUrl(resource_type)}
                    onClick={() =>
                      onNotificationClick(
                        getRedirectUrl(resource_type),
                        id,
                        mark_as_read
                      )
                    }
                  >
                    <figure className="atbd-top-dropdwon__content">
                      <Image src={noPathPic} alt="" />
                      <figcaption>
                        <Heading as="h5">
                          Software{" "}
                          <span className="color-success">
                            {distance_of_time_in_words}
                          </span>
                        </Heading>
                        <div>
                          <span className="atbd-top-dropdwonText">{from}</span>
                          <span>
                            <Badge dot={!mark_as_read} />
                          </span>
                        </div>
                      </figcaption>
                    </figure>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </Scrollbars>
      <Link className="btn-seeAll" to="#">
        See all messages
      </Link>
    </AtbdTopDropdwon>
  );

  return (
    <div className="message">
      <Popover placement="bottomLeft" content={content} action="click">
        <Badge dot={email_notification_dot} offset={[-8, -5]}>
          <Link to="#" className="head-example">
            <FeatherIcon icon="mail" size={20} />
          </Link>
        </Badge>
      </Popover>
    </div>
  );
};

MessageBox.propTypes = {
  rtl: PropTypes.bool,
};

export default MessageBox;
