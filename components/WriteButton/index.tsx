import { ButtonHTMLAttributes, useEffect } from "react";
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import useDebounce from "hooks/useDebounce";
import { Button } from "components/Common";
interface WriteButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  config: {
    address: string;
    abi: any[];
    functionName: string;
    args: any[];
  };
  // Dynamic Args
  enabled: boolean;
}
const WriteButton = ({
  address,
  abi,
  functionName,
  args,
  enabled,
  type,
  children,
}: WriteButtonProps) => {
  const can = useDebounce(enabled);

  const { config, error: err } = usePrepareContractWrite({
    address,
    abi,
    functionName,
    args,
    enabled: can,
  });

  const { data, write, isLoading, error } = useContractWrite(config);

  const { isLoading: isHashLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <Button
      type={type}
      className="btn-primary w-56"
      loading={isLoading || isHashLoading}
      disabled={!write}
      onClick={write?.()}
    >
      {children || "Write"}
    </Button>
  );
};

export default WriteButton;
