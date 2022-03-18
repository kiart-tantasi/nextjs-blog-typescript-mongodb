import styles from "./HowIBuildThisWebsitePage.module.css";

const HowIBuildThisWebsitePage = () => {
  return (
    <div className={styles.container}>
      <ul>
        <li>
          <a
            href="https://nextjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.nextjs}
              src="https://petchdotblog.s3.ap-southeast-1.amazonaws.com/HowIBuild/Nextjs.png"
              alt="Nextjs" />
          </a>
        </li>
        <li>
          <a
            href="https://www.typescriptlang.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
            src="https://petchdotblog.s3.ap-southeast-1.amazonaws.com/HowIBuild/TypeScript.png"
            alt="TypeScript" />
          </a>
        </li>
        <li className={styles["nodejs-li"]}>
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.nodejs}
            src="https://petchdotblog.s3.ap-southeast-1.amazonaws.com/HowIBuild/Nodejs.png"
            alt="Nodejs" />
          </a>
        </li>
        <li>
          <a
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className={styles.react}
              src="/images/HowIBuild/HowIBuild4.svg"
              alt="react" />
          </a>
        </li>
        <li>
          <a
            href="https://www.mongodb.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.mongodb} 
              src="/images/HowIBuild/HowIBuild5.svg"
              alt="MongoDB" />
          </a>
        </li>
        <li>
          <a
            href="https://marked.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.marked}
              src="/images/HowIBuild/HowIBuild6.svg"
              alt="Marked" />
          </a>
        </li>
        <li>
          <a href="https://mui.com/" target="_blank" rel="noopener noreferrer">
            <img
              className={styles.mui}
              src="/images/HowIBuild/HowIBuild7.png"
              alt="material ui" />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/auth0/node-jsonwebtoken"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
            src="/images/HowIBuild/HowIBuild8.svg"
            alt="JWT" />
          </a>
        </li>
        <li className={styles["normal-text-li"]}>
          <a
            href="https://github.com/simov/slugify"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.slugify}
          >
            Slugify
          </a>
        </li>
        <li className={styles["normal-text-li"]}>
          <a
            href="https://github.com/jshttp/cookie"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.cookie}
          >
            Cookie
          </a>
        </li>
        <li className={styles["normal-text-li"]}>
          <a
            href="https://github.com/dcodeIO/bcrypt.js"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.bcryptjs}
          >
            Bcryptjs
          </a>
        </li>

        <div className={styles["source-code"]}>
          <span><h1>source code</h1></span>
          <img src="https://cdn-icons-png.flaticon.com/512/37/37413.png" alt="arrow down" />
        </div>
        
        <li>
          <a
            href="https://github.com/kiart-tantasi/Nextjs-Blog-with-TypeScript-Marked-JWT-MongoDB"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
            src="/images/HowIBuild/HowIBuildGitHub.png"
            alt="GitHub"
            className={styles.github} />
          </a>
        </li>
      </ul>
    </div>
  );
};

export default HowIBuildThisWebsitePage;
