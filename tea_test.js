var tea = require('./tea');

input = tea.encode('this is a test, 这是一个测试')
s = tea.encrypt(input, '111111');
console.log(s);
ss = tea.decrypt(s, '111111');
output = tea.decode(ss)
console.log(output);
