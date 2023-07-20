import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

// Async bcrypt runs on the libuv pool, so hashing a password does not stall other requests.
export const encryptData = (data: string): Promise<string> => bcrypt.hash(data, SALT_ROUNDS);

export const compareData = (data: string, hash: string): Promise<boolean> => bcrypt.compare(data, hash);
