import { decrypt, encrypt, md5 } from '../../src/util/crypt';

describe('Encryption', () => {
  it('Encrypt AES 256', () => {
    const res: string = encrypt('hello_world');
    expect(typeof res).toEqual('string');

    const decryptRes: string = decrypt(res);
    expect(decryptRes).toEqual('hello_world');
    expect(typeof decryptRes).toEqual('string');
  });

  it('Decrypt AES 256', () => {
    const res: string = encrypt('hello_world_again');
    expect(typeof res).toEqual('string');

    const decryptRes: string = decrypt(res);
    expect(decryptRes).toEqual('hello_world_again');
    expect(typeof decryptRes).toEqual('string');
  });

  it('Hash as MD5', () => {
    const res: string = md5('hello_world');
    expect(res).toEqual('99b1ff8f11781541f7f89f9bd41c4a17');
    expect(typeof res).toEqual('string');
  });
});
