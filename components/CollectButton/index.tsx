import { useConnect } from "wagmi";
import { Button, Modal } from "components/Common";
import { useEffect, useState, cloneElement, ReactElement } from "react";
import useLogin from "hooks/useLogin";
import globalStore from "store/global";
import styles from "./index.module.css";
interface CollectModal {
  children: any;
  label: ReactElement;
}
const CollectButton = ({ children, label }: CollectModal) => {
  const userInfo = globalStore.useState("userInfo");

  const { connect, error, loading } = useLogin({
    onSuccess: (address: string) => {
      // 隐藏登录框
      setVisible(false);
      // 保存登录状态
      globalStore.setState({
        userInfo: {
          isLogin: true,
          address: address as string,
        },
      });
    },
  });

  const { connectors, pendingConnector } = useConnect();

  const [visible, setVisible] = useState(false);

  const [ready, setReady] = useState(false);

  const toggleVisible: any = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    setReady(true);
  }, []);

  if (userInfo.isLogin) return children;

  return (
    <>
      {cloneElement(label, { loading, onClick: toggleVisible })}
      <Modal
        footer={false}
        onClose={toggleVisible}
        visible={visible}
        className={styles.collectModal}
        title="Collect Wallet"
      >
        <div className={styles.content}>
          {connectors.map((connector) => (
            <Button
              key={connector.id}
              onClick={() => connect(connector)}
              disabled={!connector.ready && ready}
              loading={loading && connector.id === pendingConnector?.id}
            >
              {connector.name}
              {!connector.ready && ready && " (unsupported)"}
            </Button>
          ))}
        </div>
        <div className={styles.tip}>{error?.reason || error?.message}</div>
      </Modal>
    </>
  );
};

export default CollectButton;
