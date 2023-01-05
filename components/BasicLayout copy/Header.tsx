import CollectButton from "components/CollectButton";
import Button from "components/Common/Button";
import HeaderUser from "./HeaderUser";

const Header = () => (
  <div className="inline-flex items-center gap-2">
    <button className="btn btn-ghost btn-circle">
      <div className="indicator">
        <img src="/logo.png" alt="" />
        <span className="badge indicator-item badge-primary badge-xs"></span>
      </div>
    </button>
    {/* <CollectButton label={<Button>Collect Wallet</Button>}>
      <HeaderUser />
    </CollectButton> */}
  </div>
);

export default Header;
