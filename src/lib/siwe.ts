import { SiweMessage } from 'siwe';

export interface SiweConfig {
  domain: string;
  uri: string;
  statement: string;
  version: string;
}

export const createSiweMessage = (
  address: string,
  nonce: string,
  chainId: number = 8453, // Base mainnet
  config?: Partial<SiweConfig>
): SiweMessage => {
  const defaultConfig: SiweConfig = {
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'localhost:3000',
    uri: process.env.NEXT_PUBLIC_URI || 'http://localhost:3000',
    statement: 'Sign in with your wallet to access Digemart',
    version: '1',
  };

  const finalConfig = { ...defaultConfig, ...config };

  return new SiweMessage({
    domain: finalConfig.domain,
    address,
    statement: finalConfig.statement,
    uri: finalConfig.uri,
    version: finalConfig.version,
    chainId,
    nonce,
  });
};

export const prepareSiweMessage = (message: SiweMessage): string => {
  return message.prepareMessage();
};

export const validateSiweMessage = (message: string): boolean => {
  try {
    new SiweMessage(message);
    return true;
  } catch {
    return false;
  }
};
