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
   var tea = require('node-tea');

   input = tea.encode('this is a test, 这是一个测试')
   s = tea.encrypt(input, '111111');
   console.log(s);
   ss = tea.decrypt(s, '111111');
   output = tea.decode(ss)
   console.log(output);
   ```