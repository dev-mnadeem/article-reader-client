import bcrypt from 'bcrypt';

// Function to encrypt data using bcrypt
export const encryptData = (data: string) => bcrypt.hashSync(data, 10);

// Function to compare data and hash using bcrypt
export const compareData = (data: string, hash: string) => bcrypt.compareSync(data, hash);
