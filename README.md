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

   s = tea.encrypt('this is a test', '111111'); # encrypt the string
   console.log(s);
   ss = tea.decrypt(s, '111111'); # decrypt the string
   console.log(ss);
   ```