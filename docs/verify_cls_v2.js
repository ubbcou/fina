const crypto = require('crypto');

const salt = '37089408432360b098317781b212f718';
const verifySign = 'a0bf98714b4920456400e277692766c9';
const paramsObj = {
    app: 'CailianpressWeb',
    hasFirstVipArticle: '1',
    lastTime: '1767972908',
    os: 'web',
    rn: '20',
    subscribedColumnIds: '',
    sv: '8.4.6'
};

function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}
function sha1(text) {
    return crypto.createHash('sha1').update(text).digest('hex');
}
function hmac(text, key) {
    return crypto.createHmac('md5', key).update(text).digest('hex');
}

// Variations
const keys = Object.keys(paramsObj).sort();
const qs = keys.map(k => `${k}=${paramsObj[k]}`).join('&');
const qsNoEmpty = keys.filter(k => paramsObj[k] !== '').map(k => `${k}=${paramsObj[k]}`).join('&');
const qsRaw = Object.keys(paramsObj).map(k => `${k}=${paramsObj[k]}`).join('&'); // Unsorted

const attempts = [
    { name: 'Sorted QS + Salt', val: qs + salt },
    { name: 'Salt + Sorted QS', val: salt + qs },
    { name: 'Sorted QS (No Empty) + Salt', val: qsNoEmpty + salt },
    { name: 'Salt + Sorted QS (No Empty)', val: salt + qsNoEmpty },
    { name: 'Raw QS + Salt', val: qsRaw + salt },
    { name: 'Salt + Raw QS', val: salt + qsRaw }
];

console.log('Target:', verifySign);
attempts.forEach(att => {
    const m = md5(att.val);
    const s = sha1(att.val); // SHA1 will be 40 chars, so unlikely to match 32 char target
    // console.log(`${att.name} (MD5): ${m}`);
    if (m === verifySign) console.log(`MATCH MD5: ${att.name}`);
});

console.log('Testing HMAC...');
attempts.forEach(att => {
    // att.val is the string, key is salt? Or att.val is params, key is salt
    // Logic usually: hmac(params, salt)
    const h = hmac(qs, salt);
    if (h === verifySign) console.log(`MATCH HMAC Sorted: ${h}`);

    const h2 = hmac(qsNoEmpty, salt);
    if (h2 === verifySign) console.log(`MATCH HMAC NoEmpty: ${h2}`);
});
