import { Connection, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider } from '@project-serum/anchor';

// Set our network to devnet.
const ENDPOINT = clusterApiUrl(process.env.REACT_APP_SOLANA_NETWORK);
// Options for confirming transactions
const connectionsOptions = {
  preflightCommitment: 'processed',
};



export default class ChainClient {
  constructor() {
    this.userWalletAddress = null;
    this.program = null;
    this.provider = null;
    this.programAccount = null;

    this.initializeConnectionProvider();
  }

  initializeConnectionProvider() {
    console.log(ENDPOINT);
    const connection = new Connection(ENDPOINT, connectionsOptions.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      connectionsOptions.preflightCommitment
    );

    this.provider = provider;
  }

  async connectWallet() {
    try {
      const { solana } = window;

      if (!solana || !solana.isPhantom) {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }

      console.log('Phantom wallet found! - Connecting to Wallet..');
      const response = await solana.connect();
      this.userWalletAddress = response.publicKey;
      console.log('Wallet detected, address:', response.publicKey.toString()); 
    } catch (error) {
      console.error(error);
    }
  }

  async getProgram(programAddress) {
    // Get metadata about your deployed candy machine program
    const idl = await Program.fetchIdl(programAddress, this.provider);
  
    // Create a program that you can call
    return new Program(idl, programAddress, this.provider);
  }
}
