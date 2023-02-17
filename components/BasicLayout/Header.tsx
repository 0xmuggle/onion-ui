import Menu, { MenuItem } from "./HeaderMenu";
import Link from "next/link";

const menus: MenuItem[] = [
  {
    key: "item4",
    label: "收藏",
    render: () => (
      <a
        className="text-blue-500"
        target="_blank"
        href="https://twitter.com/0xKrystal"
        rel="noreferrer"
      >
        <svg
          fill="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          className="h-5 w-5"
          viewBox="0 0 24 24"
        >
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
        </svg>
      </a>
    ),
  },
];
const Header = () => (
  <header className="sticky top-0 z-30 bg-white px-4 shadow">
    <div className="content navbar">
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
