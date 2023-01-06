import { Bars3Icon } from "@heroicons/react/24/outline";
import CollectButton from "components/CollectButton";
import { Drawer, Button } from "components/Common";
import HeaderUser from "./HeaderUser";
import Menu, { MenuItem } from "./HeaderMenu";

const menus: MenuItem[] = [
  {
    key: "item4",
    label: "Favorites",
    path: "/form",
  },
];
const Header = () => (
  <header className="sticky top-0 z-10 bg-white shadow">
    <div className="content navbar">
      <div className="navbar-center md:navbar-start">Web UI</div>
      <div className="navbar-end">
        <div className="hidden md:block">
          <Menu className="menu menu-horizontal" menus={menus} />
        </div>
      </div>
    </div>
  </header>
);

export default Header;
