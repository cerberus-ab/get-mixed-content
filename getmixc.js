const https = require('https');
const url = require('url');
const print = msg => process.stdout.write(msg.toString());

// links map & unsecure schemes
const LINKS = {
    img: 'src',
    audio: 'src',
    video: 'src',
    object: 'data',
    script: 'src',
    link: 'href',
    iframe: 'src',
    embed: 'src'
};
const SCHEMES = ['http'];

// Links collector class
class LinksCollector {
    static makePattern(ls, ps) {
        return new RegExp(`<(?:${Object.keys(ls).map(tag => `${tag}.*?${ls[tag]}`).join('|')})=[\"\']\s*(?:blob:)?(?:${ps.join('|')}):\/\/.*?>`, 'mig');
    }
    constructor(ls, ps) {
        this._regexp = this.constructor.makePattern(ls || LINKS, ps || SCHEMES);
    }
    collect(text) {
        return text.match(this._regexp) || [];
    }
}

// Mixed content class
class MixedContent {
    constructor(body, collector) {
        this.body = body;
        this.matches = (collector || new LinksCollector).collect(this.body);
        this.postFilter();
    }
    postFilter() { // filters nocss href links
        let nocss = this.matches.join('').match(/<link(?!.*?rel=[\"\']stylesheet[\"\']).*?>/mig) || [];
        this.matches = this.matches.filter(entry => !~nocss.indexOf(entry));
    }
    toString() {
        return this.matches.map(entry => `${entry}\n`).join('');
    }
}
class MixedContentReport extends MixedContent {
    toString() {
        return this.matches.length
            ? `Mixed content requests on the page (${this.matches.length}):\n${super.toString()}`
            : `The page doesn\`t have mixed content requests\n`;
    }
}

// read page body by response
function readPageBody(res) {
    return new Promise((resolve, reject) => {
        let buff = [];
        res
            // accumulate received data
            .on('data', data => buff.push(data))
            // on ending resolve with accumulated buffer
            .on('end', () => resolve(Buffer.concat(buff).toString()))
        ;
    });
}
// send request for https page by url
function getHttpsPage(pageUrl) {
    return new Promise((resolve, reject) => {
        https.get(pageUrl, res => {
            // if status code is ok then resolve
            if (res.statusCode === 200) {
                resolve(res);
            }
            // else if status code is redirect then show location
            else if (res.statusCode > 300 && res.statusCode < 400) {
                reject(Error(`The page is redirected to "${res.headers.location}"`));
            }
            // else show wrong status code
            else {
                reject(Error(`The page has returned ${res.statusCode} status code`));
            }
        }).on('error', e => reject(Error(`The page is unreachable`)));
    });
}

// get mixed content on https page
getHttpsPage(url.parse(process.argv[2]))
    .then(res => readPageBody(res))
    .then(body => print(new MixedContentReport(body)))
    .catch(error => print(error + '\n'))
;