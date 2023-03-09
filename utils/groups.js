import crypto from 'crypto';

export const generateJoinCode = (groupId, salt) => crypto
  .pbkdf2Sync(groupId, salt, 1000, 10, 'sha512')
  .toString('hex');

export const verifyJoinCode = (groupId, salt, joinCode) => generateJoinCode(groupId, salt)
    === joinCode;
