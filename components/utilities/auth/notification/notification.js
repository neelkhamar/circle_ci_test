import React, { useEffect } from "react";
import { Badge } from "antd";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { Popover } from "../../../popup/popup";

const NotificationBox = () => {
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification.data);

  useEffect(() => {
    console.log("hello theree");
  });

  const popoverContent = (
    <div>
      {notification.map((item) => {
        const { id, from } = item;
        return (
          <Link key={id} href="#">
            {from}
          </Link>
        );
      })}
      <p>
        <Link style={{ display: "block", textAlign: "center" }} href="#">
          Read more
        </Link>
      </p>
    </div>
  );

  return (
    <div className="notification" style={{ marginTop: 10 }}>
      <Popover
        placement="bottomLeft"
        title="Notification List"
        content={popoverContent}
        trigger="click"
      >
        <Badge dot offset={[-8, -5]}>
          <Link href="#" className="head-example">
            <i className="bx bx-search"></i>
          </Link>
        </Badge>
      </Popover>
    </div>
  );
};

export default NotificationBox;
