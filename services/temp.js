import { ethers } from 'ethers';

const provider = new ethers.providers.JsonRpcProvider('https://mainnet.base.org');
provider.getNetwork()
  .then(console.log)
  .catch(console.error);