import { Badge } from "antd";
import FeatherIcon from "feather-icons-react";
import Router from "next/router";
import PropTypes from "prop-types";
import { useContext, useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  createNotificationList,
  readNotificationList,
} from "../../../redux/notification/actionCreator";
import { setMarkAsRead } from "../../../requests/notification";
import Heading from "../../heading/heading";
import { SocketContext } from "../../Layouts/layout/socketContext";
import { Popover } from "../../popup/popup";
import { AtbdTopDropdwon } from "./auth-info-style";

const NotificationBox = () => {
  const socketContext = useContext(SocketContext);
  const [spinner, setSpinner] = useState(false);
  const [notification_dot, setNotificationDot] = useState(false);
  const [unread_notification_count, setUnreadNotificationCount] = useState(0);
  const { currentUser } = useSelector((state) => {
    return {
      currentUser: state.auth.currentUser,
    };
  });

  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification.data);

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
      backgroundColor: "grey",
    };
    return <div style={{ ...style, ...thumbStyle }} props={props} />;
  };

  const renderTrackVertical = () => {
    const thumbStyle = {
      position: "absolute",
      width: "7px",
      // transition: 'opacity 200ms ease 0s',
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
    let show_notificatio_dot = false;
    notification.map((item) => {
      if (!item.mark_as_read) {
        show_notificatio_dot = true;
        count = count + 1;
      }
    });
    setNotificationDot(show_notificatio_dot);
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
          dispatch(readNotificationList(currentUser));
        },
        (error) => {
          setSpinner(false);
        }
      );
    }
  };

  const content = (
    <AtbdTopDropdwon className="atbd-top-dropdwon">
      <Heading as="h5" className="atbd-top-dropdwon__title">
        <span className="title-text">Notifications</span>
        <Badge className="badge-success" count={unread_notification_count} />
      </Heading>
      <Scrollbars
        autoHeight
        autoHide
        renderThumbVertical={renderThumb}
        renderView={renderView}
        renderTrackVertical={renderTrackVertical}
      >
        <ul className="atbd-top-dropdwon__nav notification-list">
          {notification.map((item) => {
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
                  <div className="atbd-top-dropdwon__content notifications">
                    <div className="notification-icon bg-primary">
                      <FeatherIcon icon="hard-drive" />
                    </div>
                    <div className="notification-content d-flex">
                      <div className="notification-text">
                        <Heading as="h5">
                          <span>{from}</span>
                        </Heading>
                        <p>{distance_of_time_in_words}</p>
                      </div>
                      <div className="notification-status">
                        <Badge dot={!mark_as_read} />
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Scrollbars>
      <Link className="btn-seeAll" to="#">
        See all incoming activity
      </Link>
    </AtbdTopDropdwon>
  );

  const receiveHandler = (response) => {
    if (response && response.notifications && response.notifications.length) {
      let read = [];
      let unread = [];
      response.notifications.map((val) => {
        let obj = {};
        obj["from"] = val.body;
        obj["resource_type"] = val.resource_type;
        obj["distance_of_time_in_words"] = val.distance_of_time_in_words || "";
        obj["mark_as_read"] = val.mark_as_read;
        obj["id"] = val.id;
        if (val.mark_as_read) {
          read.push(obj);
        } else {
          unread.push(obj);
        }
      });
      dispatch(createNotificationList(unread.concat(read)));
    }
  };

  return (
    <>
      <>
        {currentUser && socketContext ? (
          <socketContext.ActionCableConsumer
            channel={{ channel: "NotificationChannel" }}
            onReceived={receiveHandler}
          />
        ) : null}
      </>
      <div className="notification">
        <Popover placement="bottomLeft" content={content} action="click">
          <Badge dot={notification_dot} offset={[-8, -5]}>
            <Link to="/" className="head-example">
              <FeatherIcon icon="bell" size={20} />
            </Link>
          </Badge>
        </Popover>
      </div>
    </>
  );
};

export default NotificationBox;
