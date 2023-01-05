import { Bars3Icon } from "@heroicons/react/24/outline";
import CollectButton from "components/CollectButton";
import { Drawer, Button } from "components/Common";
import HeaderUser from "./HeaderUser";
import Menu, { MenuItem } from "./HeaderMenu";

const menus: MenuItem[] = [
  {
    key: "item2",
    label: "Nav 1",
    childs: [
      {
        key: "item2-2",
        label: "Nav 1 - 1",
      },
      {
        key: "item2-3",
        label: "Nav 1 - 2",
        path: "/2",
      },
    ],
  },
  {
    key: "item4",
    label: "Nav 2",
    path: "/form",
  },
];
const Header = () => (
  <header className="sticky top-0 z-10 bg-white shadow">
    <div className="content navbar">
      <div className="navbar-start md:hidden">
        <Drawer
          placement="left"
          title={<div className="text-center">Web UI</div>}
          button={<Bars3Icon width={24} />}
        >
          <Menu className="menu" menus={menus} />
        </Drawer>
      </div>
      <div className="navbar-center md:navbar-start">Web UI</div>
      <div className="navbar-end">
        <div className="hidden md:block">
          <Menu className="menu menu-horizontal" menus={menus} />
        </div>
        <CollectButton label={<Button>Login</Button>}>
          <HeaderUser />
        </CollectButton>
      </div>
    </div>
  </header>
);

export default Header;
