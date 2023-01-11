import Menu, { MenuItem } from "./HeaderMenu";
import { toast } from "react-toastify";
import Link from "next/link";

const menus: MenuItem[] = [
  {
    key: "item4",
    label: "收藏",
    path: "/form",
    onClick: () => {
      toast.info("功能开发中，敬请期待...");
    },
  },
];
const Header = () => (
  <header className="sticky top-0 z-30 bg-white shadow">
    <div className="content navbar px-4">
      <div className="navbar-center font-bold text-primary md:navbar-start">
        <Link href="/">
          <a className="flex items-center gap-x-2 text-xl">
            <img width={40} src="/favicon.ico" alt="Onion" />
            Onion
          </a>
        </Link>
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
