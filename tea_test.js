var tea = require('./tea');

input = tea.encodeUtf8('this is a test, 这是一个测试')
s = tea.encrypt(input, '111111');
console.log(s);
ss = tea.decrypt(s, '111111');
output = tea.decodeUtf8(ss)
console.log(output);

input = tea.encodeUtf8('this is a test, 这是一个测试')
s = tea.encryptBase64(input, '111111');
console.log(s);
ss = tea.decryptBase64(s, '111111');
output = tea.decodeUtf8(ss)
console.log(output);

