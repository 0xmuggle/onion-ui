import Menu from "./HeaderMenu";
import Footer from "./Footer";
import Header from "./Header";
import styles from "./index.module.css";

const BasicLayout = ({ children }: any) => (
  <div className={styles.basic}>
    <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
    <div className={`${styles.content} drawer-content`}>
      <div
        className="navbar sticky top-0 z-20 w-full backdrop-blur-sm"
        style={{ backgroundColor: "rgba(0,0,255, 0.1)" }}
      >
        <div className="flex-none lg:hidden">
          <label htmlFor="my-drawer-3" className="btn btn-ghost btn-square">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="inline-block h-6 w-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </label>
        </div>
        <div className="mx-2 flex-1 px-2">Web3 UI</div>
        <div className="navbar-end">
          <div className="hidden lg:block">
            <Menu className="menu menu-horizontal" />
          </div>
          <Header />
        </div>
      </div>
      {children}
      <Footer />
    </div>
    <div className="drawer-side">
      <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
      <Menu className="menu w-80 overflow-y-auto bg-base-100 p-4" />
    </div>
  </div>
);
export default BasicLayout;
