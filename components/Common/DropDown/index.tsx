import { ReactNode } from "react";

interface Props {
  children: any;
  position: "end" | "top" | "left" | "right";
  type: "hover" | "click";
  label: ReactNode;
}
const DropDown = ({
  children,
  position = "end",
  type = "hover",
  label,
}: any) => {
  return (
    <div className={`dropdown dropdown-${position} dropdown-${type}`}>
      <label tabIndex={0} className="cursor-pointer">
        {label}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
      >
        {children}
      </ul>
    </div>
  );
};

export default DropDown;
