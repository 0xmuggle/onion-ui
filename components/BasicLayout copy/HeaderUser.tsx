import { useDisconnect } from "wagmi";
import { Avatar, DropDown } from "components/Common";
import globalStore from "store/global";

const HeaderUser = () => {
  const userInfo = globalStore.useState("userInfo");

  const { disconnectAsync } = useDisconnect();

  const disconnect = async () => {
    try {
      await disconnectAsync();
      // TODO Logout
    } finally {
      globalStore.setState({
        userInfo: {
          isLogin: false,
          address: "",
        },
      });
    }
  };
  return (
    <DropDown
      type="click"
      label={
        <Avatar
          className="btn btn-ghost btn-circle"
          avatar={userInfo.address}
        />
      }
    >
      <li>
        <a className="justify-between">
          Profile
          <span className="badge">New</span>
        </a>
      </li>
      <li>
        <a>Settings</a>
      </li>
      <li onClick={() => disconnect()}>
        <a>LogOut</a>
      </li>
    </DropDown>
  );
};

export default HeaderUser;
