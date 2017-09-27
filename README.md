# node-tea

A string encrypt & decrypt package based on TEA

# get & use

1. get it
   
   ```bash
   git clone git@github.com:fiefdx/node-tea.git

   or

   npm install node-tea
   
   ```
2. use it
   
   ```javascript
   let tea = require('./tea');

   {
      let input = tea.encodeUtf8('this is a test, 这是一个测试');
      let s = tea.encrypt(input, '111111');
      console.log(s);
      let ss = tea.decrypt(s, '111111');
      let output = tea.decodeUtf8(ss);
      console.log(output);
   }

   {
      let input = tea.encodeUtf8('this is a test, 这是一个测试');
      let s = tea.encryptBase64(input, '111111');
      console.log(s);
      let ss = tea.decryptBase64(s, '111111');
      let output = tea.decodeUtf8(ss);
      console.log(output);
   }

   {
      let input = tea.strToBytes(tea.encodeUtf8('this is a test, 这是一个测试'));
      let s = tea.encryptBytes(input, '111111');
      console.log(s);
      let ss = tea.decryptBytes(s, '111111');
      let output = tea.decodeUtf8(tea.bytesToStr(ss));
      console.log(output);
   }
   ```