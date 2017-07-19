var tea = require('./tea');

s = tea.encrypt('this is a test', '111111');
console.log(s);
ss = tea.decrypt(s, '111111');
console.log(ss);
