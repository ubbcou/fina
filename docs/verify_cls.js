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

function calculateMd5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

// Try 1: Salt + QueryString
// Try 2: QueryString + Salt
// Try 3: Salt + SortedQueryString
// Try 4: SortedQueryString + Salt

const queryString = Object.keys(paramsObj).map(k => `${k}=${paramsObj[k]}`).join('&');
// console.log('QS:', queryString);

const sortedKeys = Object.keys(paramsObj).sort();
const sortedQueryString = sortedKeys.map(k => `${k}=${paramsObj[k]}`).join('&');
// console.log('Sorted QS:', sortedQueryString);

const attempts = [
    { name: 'QS + Salt', val: queryString + salt },
    { name: 'Salt + QS', val: salt + queryString },
    { name: 'Sorted QS + Salt', val: sortedQueryString + salt },
    { name: 'Salt + Sorted QS', val: salt + sortedQueryString },
    // Maybe SHA1?
];

console.log('Target:', verifySign);
attempts.forEach(att => {
    const hash = calculateMd5(att.val);
    console.log(`${att.name}: ${hash} ${hash === verifySign ? 'MATCH!' : ''}`);
});
