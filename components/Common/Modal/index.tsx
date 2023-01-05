import classNames from "classnames";
import { useState } from "react";
import Portal from "@rc-component/portal";
import Button from "../Button";
import styles from "./index.module.css";

interface Props {
  visible: boolean;
  onClose?: any;
  onOk?: any;
  className?: string;
  children: any;
  okText?: string;
  cancelText?: string;
  title?: string;
  footer?: any;
}
const Modal = ({
  visible,
  onClose,
  onOk,
  className,
  children,
  cancelText,
  okText,
  title,
  footer,
}: Props) => {
  const [loading, setLoading] = useState(false);
  const doOk = async () => {
    try {
      setLoading(true);
      await onOk?.();
    } finally {
      setLoading(false);
    }
  };
  return (
    <Portal open={visible}>
      <div
        className={classNames(
          `${styles.modalBox} modal-open modal backdrop-blur`
        )}
      >
        <div className={`modal-box ${className}`}>
          <label
            onClick={onClose}
            className={classNames({
              "btn-disabled": loading,
            })}
          >
            ✕
          </label>
          {title && <h3 className={styles.title}>{title}</h3>}
          <div className="p-6">
            {children}
            {footer && (
              <div className="mt-4 flex justify-end gap-4">
                <Button onClick={onClose} className="btn-outline">
                  {cancelText}
                </Button>
                <Button onClick={doOk} className="btn-primary">
                  {okText}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Portal>
  );
};

Modal.defaultProps = {
  className: "w-11/12 max-w-5xl",
  okText: "Confirm",
  cancelText: "Cancel",
  title: "",
  footer: true,
};

export default Modal;
