import { Connection, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import filekp from './keypair.json';



let envkp;
if (process.env.REACT_APP_KEYPAIR !== undefined) {
  envkp = JSON.parse(process.env.REACT_APP_KEYPAIR);
}
const kp = envkp || filekp;

// eslint-disable-next-line no-underscore-dangle
const arr = Object.values(kp._keypair.secretKey);
const secret = new Uint8Array(arr);
const baseAccount = web3.Keypair.fromSecretKey(secret);


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

  async refreshAccount() {
    this.account = this.program.account.baseAccount.fetch(baseAccount.publicKey).account;
  }
}
