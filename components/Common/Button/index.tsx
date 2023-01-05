import classnames from "classnames";
import { useState } from "react";

export interface Props {
  children: any;
  onClick?: any;
  disabled?: boolean;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  loading: boolean;
  type?: "button" | "reset" | "submit";
}

const ButtonButton = ({
  children,
  onClick,
  disabled,
  className,
  size,
  loading: outLoading,
  type = "button",
}: Props) => {
  const [loading, setLoading] = useState(false);
  const doClick = async () => {
    try {
      setLoading(true);
      await onClick();
    } finally {
      setLoading(false);
    }
  };
  return (
    <button
      type={type}
      className={classnames(`btn normal-case ${className}`, {
        "btn-xs": size === "xs",
        "btn-sm": size === "sm",
        "btn-md": size === "md",
        "btn-disabled": disabled || loading || outLoading,
        loading: loading || outLoading,
      })}
      onClick={doClick}
    >
      {children}
    </button>
  );
};

ButtonButton.defaultProps = {
  onClick: () => {},
  disabled: false,
  className: "",
  size: "sm",
  loading: false,
};

export default ButtonButton;
