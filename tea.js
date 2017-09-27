/* - - - - - - - - - - - - - - - - Tea by fiefdx- - - - - - - - - - - - - - - - -  */

"use strict";

var SparkMD5 = require('./spark-md5');
var Long = require('./long');

var Tea = {};

Tea.random = function (s, e) {
    return Math.floor((Math.random() * e) + s); //[s, e]
}

Tea.teaEncrypt = function (v, k, tea_sum) {
    var v0 = v[0], v1 = v[1], sum = 0;
    var delta = 0x9e3779b9;
    var k0 = k[0], k1 = k[1], k2 = k[2], k3 = k[3];
    for (var i = 0; i < tea_sum; i++) {
        sum += delta;
        v0 += ((v1<<4) + k0) ^ (v1 + sum) ^ ((v1>>>5) + k1);
        v1 += ((v0<<4) + k2) ^ (v0 + sum) ^ ((v0>>>5) + k3);
    } 
    v[0] = v0 & 0x00000000ffffffff; v[1] = v1 & 0x00000000ffffffff;
}

Tea.teaDecrypt = function (v, k, tea_sum) {
    var v0 = v[0], v1 = v[1], sum = 0xc6ef3720;
    var delta = 0x9e3779b9;
    var k0 = k[0], k1 = k[1], k2 = k[2], k3 = k[3];
    if (tea_sum == 64) {
        sum = 0x8DDE6E40;
    }
    for (var i = 0; i < tea_sum; i++) {
        v1 -= ((v0<<4) + k2) ^ (v0 + sum) ^ ((v0>>>5) + k3);
        v0 -= ((v1<<4) + k0) ^ (v1 + sum) ^ ((v1>>>5) + k1);
        sum -= delta;
    }
    v[0] = v0 & 0x00000000ffffffff; v[1] = v1 & 0x00000000ffffffff;
}

Tea.teaStrEncrypt = function (v, k, tea_sum) {
    var i_0, i_1;
    var v_tmp = [0, 0];
    var cipertext = new Long(0x00000000, 0x00000000, true);
    var pre_plaintext = new Long(0x00000000, 0x00000000, true);
    var plaintext = new Long(0x00000000, 0x00000000, true);
    var encrypt_text = new Long(0x00000000, 0x00000000, true);
    var and_flag = new Long(0xffffffff, 0x00000000, true);
    var length = v.length / 2;

    pre_plaintext = pre_plaintext.or(and_flag.and(v[0]));
    pre_plaintext = pre_plaintext.shiftLeft(32);
    pre_plaintext = pre_plaintext.or(v[1]);
    v_tmp[0] = v[0];
    v_tmp[1] = v[1];
    Tea.teaEncrypt(v_tmp, k, tea_sum);
    v[0] = v_tmp[0];
    v[1] = v_tmp[1];
    cipertext = cipertext.or(and_flag.and(v[0]));
    cipertext = cipertext.shiftLeft(32);
    cipertext = cipertext.or(and_flag.and(v[1]));
    for (var i = 1; i<length; i++){
        i_0 = i*2;
        i_1 = i_0 + 1;
        plaintext = plaintext.or(and_flag.and(v[i_0]));
        plaintext = plaintext.shiftLeft(32);
        plaintext = plaintext.or(and_flag.and(v[i_1]));
        plaintext = plaintext.xor(cipertext);
        v_tmp[0] = plaintext.shiftRightUnsigned(32).toUnsigned().toInt();
        v_tmp[1] = plaintext.toUnsigned().toInt();
        Tea.teaEncrypt(v_tmp, k, tea_sum);
        v[i_0] = v_tmp[0];
        v[i_1] = v_tmp[1];
        encrypt_text = encrypt_text.or(and_flag.and(v[i_0]));
        encrypt_text = encrypt_text.shiftLeft(32);
        encrypt_text = encrypt_text.or(and_flag.and(v[i_1]));
        encrypt_text = encrypt_text.xor(pre_plaintext);
        v[i_0] = encrypt_text.shiftRightUnsigned(32).toUnsigned().toInt();
        v[i_1] = encrypt_text.toUnsigned().toInt();
        cipertext = encrypt_text.toUnsigned();
        pre_plaintext = plaintext.toUnsigned();
        plaintext = new Long(0x00000000, 0x00000000, true);
        encrypt_text = new Long(0x00000000, 0x00000000, true);
    }
}

Tea.teaStrDecrypt = function (v, k, tea_sum) {
    var i_0, i_1;
    var pos = 0;
    var v_tmp = [0, 0];
    var cipertext = new Long(0x00000000, 0x00000000, true);
    var cipertext_tmp = new Long(0x00000000, 0x00000000, true);
    var pre_plaintext = new Long(0x00000000, 0x00000000, true);
    var plaintext = new Long(0x00000000, 0x00000000, true);
    var encrypt_text = new Long(0x00000000, 0x00000000, true);
    var and_flag = new Long(0xffffffff, 0x00000000, true);
    var length = v.length / 2;

    cipertext = cipertext.or(and_flag.and(v[0]));
    cipertext = cipertext.shiftLeft(32);
    cipertext = cipertext.or(and_flag.and(v[1]));
    v_tmp[0] = v[0];
    v_tmp[1] = v[1];
    Tea.teaDecrypt(v_tmp, k, tea_sum);
    v[0] = v_tmp[0];
    v[1] = v_tmp[1];
    pos = v[0];
    pre_plaintext = pre_plaintext.or(and_flag.and(v[0]));
    pre_plaintext = pre_plaintext.shiftLeft(32);
    pre_plaintext = pre_plaintext.or(and_flag.and(v[1]));
    for (var i = 1; i<length; i++){
        i_0 = i*2;
        i_1 = i_0 + 1;
        cipertext_tmp = cipertext_tmp.or(and_flag.and(v[i_0]));
        cipertext_tmp = cipertext_tmp.shiftLeft(32);
        cipertext_tmp = cipertext_tmp.or(and_flag.and(v[i_1]));
        encrypt_text = encrypt_text.or(and_flag.and(v[i_0]));
        encrypt_text = encrypt_text.shiftLeft(32);
        encrypt_text = encrypt_text.or(and_flag.and(v[i_1]));
        encrypt_text = encrypt_text.xor(pre_plaintext);
        v[i_0] = encrypt_text.shiftRightUnsigned(32).toUnsigned().toInt();
        v[i_1] = encrypt_text.toUnsigned().toInt();
        v_tmp[0] = v[i_0];
        v_tmp[1] = v[i_1];
        Tea.teaDecrypt(v_tmp, k, tea_sum);
        v[i_0] = v_tmp[0];
        v[i_1] = v_tmp[1];
        plaintext = plaintext.or(and_flag.and(v[i_0]));
        plaintext = plaintext.shiftLeft(32);
        plaintext = plaintext.or(and_flag.and(v[i_1]));
        plaintext = plaintext.xor(cipertext);
        v[i_0] = plaintext.shiftRightUnsigned(32).toUnsigned().toInt();
        v[i_1] = plaintext.toUnsigned().toInt();
        pre_plaintext = plaintext.xor(cipertext);
        cipertext = cipertext_tmp.toUnsigned();
        cipertext_tmp = new Long(0x00000000, 0x00000000, true);
        plaintext = new Long(0x00000000, 0x00000000, true);
        encrypt_text = new Long(0x00000000, 0x00000000, true);
    }
    return pos;
}

Tea.strBase64Encrypt = function (v, k) { // v: string, k: string
    var hex_k = SparkMD5.hash(SparkMD5.hash(k));
    var int_k = Tea.hexStrToInts(hex_k);
    var s_b64 = Base64.encode(v);
    var int_v = Tea.composeInts(s_b64);
    Tea.teaStrEncrypt(int_v, int_k, 32);
    var int_s = Tea.intsToStr(int_v);
    return Base64.encode(int_s);
}

Tea.strBase64Decrypt = function (v, k) { // v: string base64, k: string
    var hex_k = SparkMD5.hash(SparkMD5.hash(k));
    var int_k = Tea.hexStrToInts(hex_k);
    var s_str = Base64.decode(v);
    var int_v = Tea.strToInts(s_str);
    var pos = Tea.teaStrDecrypt(int_v, int_k, 32);
    var b64 = Tea.intsParse(int_v, pos, false);
    return Base64.decode(b64);
}

Tea.strEncrypt = function (v, k) { // v: string, k: string
    var hex_k = SparkMD5.hash(SparkMD5.hash(k));
    var int_k = Tea.hexStrToInts(hex_k);
    var int_v = Tea.composeInts(v);
    Tea.teaStrEncrypt(int_v, int_k, 32);
    return Tea.intsToStr(int_v);
}

Tea.strDecrypt = function (v, k) { // v: string, k: string
    var hex_k = SparkMD5.hash(SparkMD5.hash(k));
    var int_k = Tea.hexStrToInts(hex_k);
    var int_v = Tea.strToInts(v);
    var pos = Tea.teaStrDecrypt(int_v, int_k, 32);
    return Tea.intsParse(int_v, pos, false);
}

Tea.bytesEncrypt = function (v, k) { // v: bytes array, k: string
    var hex_k = SparkMD5.hash(SparkMD5.hash(k));
    var int_k = Tea.hexStrToInts(hex_k);
    var int_v = Tea.composeInts(v);
    Tea.teaStrEncrypt(int_v, int_k, 32);
    return Tea.intsToBytes(int_v);
}

Tea.bytesDecrypt = function (v, k) { // v: bytes array, k: string
    var hex_k = SparkMD5.hash(SparkMD5.hash(k));
    var int_k = Tea.hexStrToInts(hex_k);
    var int_v = Tea.bytesToInts(v);
    var pos = Tea.teaStrDecrypt(int_v, int_k, 32);
    return Tea.intsParse(int_v, pos, true);
}

Tea.strToBytes = function (s) {
    var bytes = [];
    for (var i = 0; i < s.length; i++) {
        bytes.push(s.charCodeAt(i));
    }
    return bytes;
}

Tea.bytesToStr = function (b) {
    var result = "";
	for(var i = 0; i < b.length; i++) {
		result += (String.fromCharCode(b[i]));
	}
	return result;
}

Tea.bytesToInts = function (b) {
    var r = new Array(b.length / 4);
    for (var i = 0; i < (b.length / 4); i++) {
        r[i] = (((b[i*4] & 0x000000ff) << 24)|
                ((b[i*4+1] & 0x000000ff) << 16)|
                ((b[i*4+2] & 0x000000ff) << 8)|
                (b[i*4+3] & 0x000000ff));
    }
    return r;
}

Tea.intsToBytes = function (i) {
    var b = new Array(i.length * 4);
    for (var j = 0; j < i.length; j++) {
        b[j*4+3] = i[j] & 0x000000ff;
        b[j*4+2] = (i[j] >>> 8) & 0x000000ff;
        b[j*4+1] = (i[j] >>> 16) & 0x000000ff;
        b[j*4] = (i[j] >>> 24) & 0x000000ff;
    }
    return b;
}

Tea.strToInts = function (s) {
    var b = Tea.strToBytes(s);
    var r = new Array(b.length / 4);
    for (var i = 0; i < (b.length / 4); i++) {
        r[i] = (((b[i*4] & 0x000000ff) << 24)|
                ((b[i*4+1] & 0x000000ff) << 16)|
                ((b[i*4+2] & 0x000000ff) << 8)|
                (b[i*4+3] & 0x000000ff));
    }
    return r;
}

Tea.intsToStr = function (i) {
    var b = new Array(i.length * 4);
    var r = "";
    for (var j = 0; j < i.length; j++) {
        b[j*4+3] = i[j] & 0x000000ff;
        b[j*4+2] = (i[j] >>> 8) & 0x000000ff;
        b[j*4+1] = (i[j] >>> 16) & 0x000000ff;
        b[j*4] = (i[j] >>> 24) & 0x000000ff;
    }
    r = Tea.bytesToStr(b);
    return r;
}

Tea.composeInts = function (s) {
    var b;
    if (s instanceof Array) { // bytes array
        b = s;
    } else { // string
        b = Tea.strToBytes(s);
    }
    var fill_n = (8 - (b.length + 2)) % 8;
    if (fill_n < 0) {
        fill_n = 8 + fill_n + 2;
    } else {
        fill_n += 2;
    }
    var fill_b = new Array(fill_n);
    for(var i = 0; i < fill_n; i++) {
        fill_b[i] = Tea.random(0, 0x7f);
    }
    var b_after_fill = new Array();
    b_after_fill.push(((fill_n - 2)|0xf8));
    b_after_fill = b_after_fill.concat(fill_b);
    b_after_fill = b_after_fill.concat(b);
    b_after_fill = b_after_fill.concat([0, 0, 0, 0, 0, 0, 0]);
    var r = new Array(b_after_fill.length / 4);
    for (var i = 0; i < (b_after_fill.length / 4); i++) {
        r[i] = (b_after_fill[i*4+3]|
                (b_after_fill[i*4+2] << 8)|
                (b_after_fill[i*4+1] << 16)|
                (b_after_fill[i*4] << 24));
    }
    return r;
}

Tea.intsParse = function (i, pos, array) {
    var b_after_fill = new Array(i.length * 4);
    var r;
    for (var j = 0; j < i.length; j++) {
        b_after_fill[j*4+3] = i[j] & 0x000000ff;
        b_after_fill[j*4+2] = (i[j] >>> 8) & 0x000000ff;
        b_after_fill[j*4+1] = (i[j] >>> 16) & 0x000000ff;
        b_after_fill[j*4] = (i[j] >>> 24) & 0x000000ff;
    }
    pos = (((pos >>> 24) & 0x000000ff) & 0x07) + 2;
    if (b_after_fill.slice(b_after_fill.length - 7, b_after_fill.length).join("") != "0000000") {
        if (array) {
            r = [];
        } else {
            r = "";
        }
    } else {
        if (array) {
            r = b_after_fill.slice(pos + 1, b_after_fill.length - 7)
        } else {
            r = Tea.bytesToStr(b_after_fill.slice(pos + 1, b_after_fill.length - 7));
        }
    }
    return r;
}

Tea.hexStrToInts = function (h) {
    var r = [];
    while (h.length >= 8) {
        r.push(parseInt(h.substring(0, 8), 16));
        h = h.substring(8, h.length);
    }
    return r;
}

Tea.strToLongs = function(s) {  // convert string to array of longs, each containing 4 chars
    // note chars must be within ISO-8859-1 (with Unicode code-point < 256) to fit 4/long
    var l = new Array(Math.ceil(s.length/4));
    for (var i=0; i<l.length; i++) {
        // note little-endian encoding - endianness is irrelevant as long as 
        // it is the same in longsToStr() 
        l[i] = s.charCodeAt(i*4) + (s.charCodeAt(i*4+1)<<8) + 
               (s.charCodeAt(i*4+2)<<16) + (s.charCodeAt(i*4+3)<<24);
    }
    return l;  // note running off the end of the string generates nulls since 
}              // bitwise operators treat NaN as 0

Tea.longsToStr = function(l) {  // convert array of longs back to string
    var a = new Array(l.length);
    for (var i=0; i<l.length; i++) {
        a[i] = String.fromCharCode(l[i] & 0xFF, l[i]>>>8 & 0xFF, 
                                   l[i]>>>16 & 0xFF, l[i]>>>24 & 0xFF);
    }
    return a.join('');  // use Array.join() rather than repeated string appends for efficiency in IE
}

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Base64 class: Base 64 encoding / decoding (c) Chris Veness 2002-2012                          */
/*    note: depends on Utf8 class                                                                 */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Base64 = {};  // Base64 namespace

Base64.code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

/**
 * Encode string into Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, no newlines are added.
 *
 * @param {String} str The string to be encoded as base-64
 * @param {Boolean} [utf8encode=false] Flag to indicate whether str is Unicode string to be encoded 
 *   to UTF8 before conversion to base64; otherwise string is assumed to be 8-bit characters
 * @returns {String} Base64-encoded string
 */ 
Base64.encode = function(str, utf8encode) {  // http://tools.ietf.org/html/rfc4648
  utf8encode =  (typeof utf8encode == 'undefined') ? false : utf8encode;
  var o1, o2, o3, bits, h1, h2, h3, h4, e=[], pad = '', c, plain, coded;
  var b64 = Base64.code;
   
  plain = utf8encode ? Utf8.encode(str) : str;
  
  c = plain.length % 3;  // pad string to length of multiple of 3
  if (c > 0) { while (c++ < 3) { pad += '='; plain += '\0'; } }
  // note: doing padding here saves us doing special-case packing for trailing 1 or 2 chars
   
  for (c=0; c<plain.length; c+=3) {  // pack three octets into four hexets
    o1 = plain.charCodeAt(c);
    o2 = plain.charCodeAt(c+1);
    o3 = plain.charCodeAt(c+2);
      
    bits = o1<<16 | o2<<8 | o3;
      
    h1 = bits>>18 & 0x3f;
    h2 = bits>>12 & 0x3f;
    h3 = bits>>6 & 0x3f;
    h4 = bits & 0x3f;

    // use hextets to index into code string
    e[c/3] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
  }
  coded = e.join('');  // join() is far faster than repeated string concatenation in IE
  
  // replace 'A's from padded nulls with '='s
  coded = coded.slice(0, coded.length-pad.length) + pad;
   
  return coded;
}

/**
 * Decode string from Base64, as defined by RFC 4648 [http://tools.ietf.org/html/rfc4648]
 * (instance method extending String object). As per RFC 4648, newlines are not catered for.
 *
 * @param {String} str The string to be decoded from base-64
 * @param {Boolean} [utf8decode=false] Flag to indicate whether str is Unicode string to be decoded 
 *   from UTF8 after conversion from base64
 * @returns {String} decoded string
 */ 
Base64.decode = function(str, utf8decode) {
  utf8decode =  (typeof utf8decode == 'undefined') ? false : utf8decode;
  var o1, o2, o3, h1, h2, h3, h4, bits, d=[], plain, coded;
  var b64 = Base64.code;

  coded = utf8decode ? Utf8.decode(str) : str;
  
  
  for (var c=0; c<coded.length; c+=4) {  // unpack four hexets into three octets
    h1 = b64.indexOf(coded.charAt(c));
    h2 = b64.indexOf(coded.charAt(c+1));
    h3 = b64.indexOf(coded.charAt(c+2));
    h4 = b64.indexOf(coded.charAt(c+3));
      
    bits = h1<<18 | h2<<12 | h3<<6 | h4;
      
    o1 = bits>>>16 & 0xff;
    o2 = bits>>>8 & 0xff;
    o3 = bits & 0xff;
    
    d[c/4] = String.fromCharCode(o1, o2, o3);
    // check for padding
    if (h4 == 0x40) d[c/4] = String.fromCharCode(o1, o2);
    if (h3 == 0x40) d[c/4] = String.fromCharCode(o1);
  }
  plain = d.join('');  // join() is far faster than repeated string concatenation in IE
   
  return utf8decode ? Utf8.decode(plain) : plain; 
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Utf8 class: encode / decode between multi-byte Unicode characters and UTF-8 multiple          */
/*              single-byte character encoding (c) Chris Veness 2002-2012                         */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

var Utf8 = {};  // Utf8 namespace

/**
 * Encode multi-byte Unicode string into utf-8 multiple single-byte characters 
 * (BMP / basic multilingual plane only)
 *
 * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
 *
 * @param {String} strUni Unicode string to be encoded as UTF-8
 * @returns {String} encoded string
 */
Utf8.encode = function(strUni) {
  // use regular expressions & String.replace callback function for better efficiency 
  // than procedural approaches
  var strUtf = strUni.replace(
      /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0);
        return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    );
  strUtf = strUtf.replace(
      /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
      function(c) { 
        var cc = c.charCodeAt(0); 
        return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
  return strUtf;
}

/**
 * Decode utf-8 encoded string back into multi-byte Unicode characters
 *
 * @param {String} strUtf UTF-8 string to be decoded back to Unicode
 * @returns {String} decoded string
 */
Utf8.decode = function(strUtf) {
  // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
  var strUni = strUtf.replace(
      /[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,  // 3-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = ((c.charCodeAt(0)&0x0f)<<12) | ((c.charCodeAt(1)&0x3f)<<6) | ( c.charCodeAt(2)&0x3f); 
        return String.fromCharCode(cc); }
    );
  strUni = strUni.replace(
      /[\u00c0-\u00df][\u0080-\u00bf]/g,                 // 2-byte chars
      function(c) {  // (note parentheses for precence)
        var cc = (c.charCodeAt(0)&0x1f)<<6 | c.charCodeAt(1)&0x3f;
        return String.fromCharCode(cc); }
    );
  return strUni;
}

exports.encryptBase64 = Tea.strBase64Encrypt
exports.decryptBase64 = Tea.strBase64Decrypt
exports.encrypt = Tea.strEncrypt
exports.decrypt = Tea.strDecrypt
exports.encryptBytes = Tea.bytesEncrypt
exports.decryptBytes = Tea.bytesDecrypt
exports.strToBytes = Tea.strToBytes
exports.bytesToStr = Tea.bytesToStr
exports.encodeUtf8 = Utf8.encode
exports.decodeUtf8 = Utf8.decode