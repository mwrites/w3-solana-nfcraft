import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import ChainClient from './chainClient.js';
import CandyMachine from './CandyMachine';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  const [chainClient, setChainClient] = useState(new ChainClient());

  // Actions

  /*
  * Declare your function
  */
  const checkIfWalletIsConnected = async () => {
    const client = new ChainClient();
    await client.connectWallet();
    setChainClient(client);
  };

   /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
   const connectWallet = async () => {};

   const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header">🍭 Candy Drop</p>
          <p className="sub-text">NFT drop machine with fair mint</p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {console.log(chainClient)}
          {chainClient && !chainClient.userWalletAddress && renderNotConnectedContainer()}
        </div>
        {chainClient.userWalletAddress && <CandyMachine chainClient={chainClient} walletAddress={window.solana} />}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
