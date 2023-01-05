import { useRef, useState } from "react";
import { Connector, useAccount, useConnect, useSignTypedData } from "wagmi";

interface LoginProps {
  onSuccess?: (address: string) => void;
}
const useLogin = ({ onSuccess }: LoginProps) => {
  const timer = useRef<any>();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState<any>(null);

  const { address, isConnected } = useAccount();

  const { connectAsync } = useConnect();

  const { signTypedDataAsync } = useSignTypedData();

  const updateError = (e: any) => {
    setError(e);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      timer.current = null;
      setError(null);
    }, 5000);
  };

  const connect = async (connector: Connector) => {
    try {
      setLoading(true);
      if (!isConnected) {
        // 链接钱包
        await connectAsync({ connector });
      }
      // 签名
      const message = `yarn defaultValuesLogin in. ${Date.now()}`;
      const sign = await signTypedDataAsync({
        domain: {},
        types: { Message: [{ name: "data", type: "string" }] },
        value: {
          data: message,
        },
      });
      // TODO login web2 获取 jwt token
      onSuccess?.(address as string);
    } catch (e) {
      updateError(e);
    } finally {
      setLoading(false);
    }
  };

  return { connect, error, loading, address };
};
export default useLogin;
