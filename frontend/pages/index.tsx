import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { Web3Button } from "../components/Web3Button";
import styles from "../styles/Home.module.css";
import logo1 from "../public/logo1.png";
import logo2 from "../public/logo2.png";
import logo3 from "../public/logo3.png";
import { useRouter } from "next/router";

const Home: NextPage = () => {
  const { query } = useRouter();
  let message = (
    <nav className="flex">
      {/* <Link href="/about">
        <a className="text-lg font-light">About</a>
      </Link> */}
      <Web3Button />
    </nav>
  );
  if (query.member === undefined) {
    message = (
      <p className={styles["result-msg"]}>
        Please visit{" "}
        <a href="https://discord.com/channels/944229849273352222/984799563531575366">
          discord channel
        </a>{" "}
        to verify you roles in SubDAO.
      </p>
    );
  }

  return (
    <div className="flex h-screen flex-col">
      <Head>
        <title>SubDAO Verification</title>
        <meta name="description" content="HeadDAO Verification WebApp" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Head>

      {message}

      <div className={styles["logos-container"]}>
        <Image src={logo1} alt="HeadDAO" />
        <Image src={logo2} alt="SubDAO" />
        <Image src={logo3} alt="MineGai" />
      </div>
    </div>
  );
};

export default Home;
