import Link from "next/link";
import { Fragment } from "react";
export interface MenuItem {
  key: string;
  label: string;
  onClick?: any;
  path?: string;
  render?: any;
  childs?: MenuItem[];
}

interface Props {
  className: string;
  menus: MenuItem[];
}

const Menu = ({ menus, className }: Props) => {
  const horizontal = className.includes("horizontal");

  const renderItem = (menu: MenuItem) => {
    if (menu.render) {
      return menu.render();
    }
    if (menu.onClick) {
      return (
        <li onClick={menu.onClick}>
          <a>{menu.label}</a>
        </li>
      );
    }
    if (menu.path) {
      return (
        <li>
          <Link href={menu.path}>{menu.label}</Link>
        </li>
      );
    }
    if (menu.childs) {
      if (horizontal) {
        return (
          <li tabIndex={0}>
            <a>
              {menu.label}
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="menu rounded-box w-56 bg-base-100 shadow">
              {renderMenus(menu.childs)}
            </ul>
          </li>
        );
      }
      return (
        <div>
          <li className="menu-title">
            <span>{menu.label}</span>
          </li>
          {renderMenus(menu.childs)}
        </div>
      );
    }
    return (
      <li className="disabled">
        <a>{menu.label}</a>
      </li>
    );
  };

  const renderMenus: any = (items: MenuItem[]) =>
    items.map((item: MenuItem) => (
      <Fragment key={item.key}>{renderItem(item)}</Fragment>
    ));

  return <ul className={className}>{renderMenus(menus)}</ul>;
};

export default Menu;
