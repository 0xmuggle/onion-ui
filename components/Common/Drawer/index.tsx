import React, {
  cloneElement,
  useCallback,
  ReactElement,
  useState,
} from "react";
import Drawer, { DrawerProps } from "rc-drawer";
import motionProps from "./motion";
import styles from "./index.module.css";

interface Props extends DrawerProps {
  title?: ReactElement | string;
  button: ReactElement;
}

const CDrawer = ({ title, button, onClose, children, ...props }: Props) => {
  const [open, setOpen] = useState(false);

  const onClick = (e: any) => {
    e?.preventDefault();
    setOpen(true);
  };

  const doClose = (e: any) => {
    console.log(">>> doClose");
    onClose?.(e);
    setOpen(false);
  };

  const renderButton = useCallback(() => {
    return cloneElement(button, { onClick, className: "cursor-pointer" });
  }, []);

  return (
    <React.Fragment>
      {renderButton()}
      <Drawer
        open={open}
        onClose={doClose}
        maskClosable
        destroyOnClose
        maskClassName="backdrop-blur"
        {...motionProps}
        {...props}
      >
        <div className={styles.drawer}>
          <div className={styles.title}>{title}</div>
          <div className={styles.content}>{children}</div>
          <div className={styles.footer}>hh</div>
        </div>
      </Drawer>
    </React.Fragment>
  );
};
export default CDrawer;
