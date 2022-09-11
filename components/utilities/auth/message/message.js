import FeatherIcon from "feather-icons-react";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import { Popover } from "../../../popup/popup";

const MessageBox = () => {
  const dispatch = useDispatch();
  const message = [];

  const popoverContent = (
    <div>
      {message.map((item) => {
        const { id, from } = item;
        return (
          <NavLink key={id} to="#">
            {from}
          </NavLink>
        );
      })}
      <p>
        <NavLink style={{ display: "block" }} to="#">
          Read more
        </NavLink>
      </p>
    </div>
  );

  return (
    <div className="message">
      {/* <div className="message" style={{ marginTop: 10 }}> */}
      <Popover
        placement="bottomLeft"
        title="Message List"
        content={popoverContent}
        trigger="click"
      >
        {/* <Badge dot={false} offset={[-8, -5]}> */}
        <NavLink to="#" className="head-example">
          <FeatherIcon icon="mail" size={20} />
        </NavLink>
        {/* </Badge> */}
      </Popover>
    </div>
  );
};

export default MessageBox;
