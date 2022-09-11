import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Content, PopoverStyle, Title } from "./style";

const Popover = (props) => {
  const { content, placement, title, action, children } = props;
  const content1 = <Content>{content}</Content>;

  return (
    <PopoverStyle
      placement={placement}
      title={title && <Title>{title}</Title>}
      content={content1}
      trigger={action}
    >
      {children}
    </PopoverStyle>
  );
};

const content = (
  <>
    <Link href="#">
      <i className="bx bx-search"></i>
      <span>Btn Dropdown one</span>
    </Link>
  </>
);

Popover.defaultProps = {
  action: "hover",
  placement: "bottomCenter",
  content,
};

Popover.propTypes = {
  placement: PropTypes.string,
  title: PropTypes.string,
  action: PropTypes.string,
  content: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export { Popover };
