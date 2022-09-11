import React from "react";
import { PageHeaderStyle } from "./style";

const PageHeader = (props) => {
  const { title, subTitle, routes, buttons, ghost, bgColor, className } = props;

  return (
    <>
      <div
        style={{
          backgroundColor: bgColor || "#F4F5F7",
        }}
      >
        <PageHeaderStyle
          style={{
            backgroundColor: "rgb(244, 245, 247)",
          }}
          className={className}
          title={title}
          subTitle={subTitle}
          breadcrumb={routes && { routes }}
          extra={buttons}
          ghost={ghost}
        />
      </div>
    </>
  );
};

export { PageHeader };
