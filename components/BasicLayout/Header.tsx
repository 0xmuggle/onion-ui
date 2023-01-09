import { Bars3Icon } from "@heroicons/react/24/outline";
import CollectButton from "components/CollectButton";
import { Drawer, Button } from "components/Common";
import HeaderUser from "./HeaderUser";
import Menu, { MenuItem } from "./HeaderMenu";
import { toast } from "react-toastify";

const menus: MenuItem[] = [
  {
    key: "item4",
    label: "Favorites",
    path: "/form",
    onClick: () => {
      toast.info("Coming Soon");
    },
  },
];
const Header = () => (
  <header className="sticky top-0 z-20 bg-white shadow">
    <div className="content navbar">
      <div className="navbar-center text-2xl font-bold text-primary md:navbar-start">
        Onion
      </div>
      <div className="navbar-end">
        <div className="hidden md:block">
          <Menu className="menu menu-horizontal" menus={menus} />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
