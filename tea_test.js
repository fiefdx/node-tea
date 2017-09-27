"use strict";

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
