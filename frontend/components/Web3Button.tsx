import { useWeb3 } from "../hooks/Web3Client";
import styles from "../styles/Home.module.css";

interface ConnectProps {
  connect: (() => Promise<void>) | null;
}

const ConnectButton = ({ connect }: ConnectProps) => {
  return connect ? (
    <button className={styles.button} onClick={connect} />
  ) : (
    <button>Loading...</button>
  );
};

interface DisconnectProps {
  disconnect: (() => Promise<void>) | null;
}

const DisconnectButton = ({ disconnect }: DisconnectProps) => {
  return disconnect ? (
    <button onClick={disconnect}>Disconnect</button>
  ) : (
    <button>Loading...</button>
  );
};

const ResultMessage = () => {
  return (
    <p className={styles["result-msg"]}>
      You can go back to SubDAO channel to see your verification result!
    </p>
  );
};

export function Web3Button() {
  const { web3Provider, connect } = useWeb3();
  return web3Provider ? <ResultMessage /> : <ConnectButton connect={connect} />;
}
