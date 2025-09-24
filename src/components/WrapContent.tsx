import React from "react";

const WrapContent = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}): React.JSX.Element => {
  return (
    <div className="lg:px-8 px-5 ui-mx-auto" id="wrapper" style={style}>
      {children}
    </div>
  );
};

export default WrapContent;
