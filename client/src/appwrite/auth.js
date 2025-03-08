import { account } from './config';

export const createAccount = async (email, password, name) => {
    return await account.create('unique()', email, password, name);
};

export const login = async (email, password) => {
    return await account.createEmailPasswordSession(email, password);
};

export const logout = async () => {
    return await account.deleteSession('current');
};

export const getCurrentUser = async () => {
    return await account.get();
};