import styles from "./logo.module.scss";

const Logo: React.FunctionComponent<{}> = (prop) => {
  return (
    <div className={styles.logoContainer}>
      <div className={styles.logo} />
    </div>
  );
};

export default Logo;