import Footer from "./Footer";
import Header from "./Header";
import styles from "./index.module.css";

const BasicLayout = ({ children }: any) => (
  <div className={styles.basic}>
    <Header />
    {children}
    <Footer />
  </div>
);
export default BasicLayout;
