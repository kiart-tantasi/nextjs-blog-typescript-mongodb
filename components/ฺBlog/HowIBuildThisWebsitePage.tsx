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
            <img className={styles.nextjs} src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Nextjs-logo.svg/2560px-Nextjs-logo.svg.png" alt="Nextjs" />
          </a>
        </li>
        <li>
          <a
            href="https://www.typescriptlang.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="https://cdn.worldvectorlogo.com/logos/typescript-2.svg" alt="TypeScript" />
          </a>
        </li>
        <li className={styles["nodejs-li"]}>
          <a
            href="https://nodejs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.nodejs} src="https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg" alt="Nodejs" />
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
              src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K"
              alt="react" />
          </a>
        </li>
        <li>
          <a
            href="https://www.mongodb.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.mongodb} src="https://webimages.mongodb.com/_com_assets/cms/kuyjf3vea2hg34taa-horizontal_default_slate_blue.svg?auto=format%252Ccompress" alt="MongoDB" />
          </a>
        </li>
        <li>
          <a
            href="https://marked.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img className={styles.marked} src="https://marked.js.org/img/logo-black.svg" alt="Marked" />
          </a>
        </li>
        <li>
          <a href="https://mui.com/" target="_blank" rel="noopener noreferrer">
            <img
              className={styles.mui}
              src="https://mui.com/static/logo.png"
              alt="material ui" />
          </a>
        </li>
        <li>
          <a
            href="https://github.com/auth0/node-jsonwebtoken"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="http://jwt.io/img/logo-asset.svg" alt="JWT" />
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
        <li className={styles["normal-text-li"]}>
          <a
            href="https://github.com/kiart-tantasi/Nextjs-Blog-with-TypeScript-Marked-JWT-MongoDB"
            target="_blank"
            rel="noopener noreferrer"
          >
            SOURCE CODE
          </a>
        </li>
      </ul>
    </div>
  );
};

export default HowIBuildThisWebsitePage;
