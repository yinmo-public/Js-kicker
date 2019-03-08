const LineAPI  = require('./api');
var config = require('./config');
var moment = require('moment');

class LineConnect extends LineAPI {

  constructor(options) {
    super();

    if (typeof options !== 'undefined') {
      this.authToken = options.authToken;
      this.certificate = options.certificate;
      this.config.Headers['X-Line-Access'] = options.authToken;
    }
  }
  
  getQrFirst() {
    return new Promise((resolve,reject) => {
      this._qrCodeLogin().then(async (res) => {
        this.authToken = res.authToken;
        this.certificate = res.certificate;
        let { mid, displayName } = await this._client.getProfile();config.botmid = mid;
        console.info(`[*] Name: ${displayName}`);
        console.info(`[*] MID: ${mid}`);
        await this._tokenLogin(this.authToken, this.certificate);
        console.info(`[*] Token: ${this.authToken}`);
        console.info(`[*] Certificate: ${res.certificate}`);
        await this._chanConn();
        console.info(`=======BOT RUNNING======\n`);
        resolve();
      });
    });
  }

  async startx () {
    if (typeof this.authToken != 'undefined'){
      await this._tokenLogin(this.authToken, this.certificate);
	  this._client.removeAllMessages();
      return this.longpoll();
    } else if(this.password && this.email){
    return new Promise((resolve, reject) => {
      this._xlogin(this.email,this.password).then(()=>{
        this._chanConn();
        console.info("Success Login!");
        console.info(`\n[*] Token: ${config.tokenn}`);
        this.config.Headers['X-Line-Access'] = config.tokenn;
        this._channel.issueChannelToken("1341209950",(err, result)=>{
          config.chanToken = result.channelAccessToken;
          this._client.getLastOpRevision((err,result)=>{
              let xrx = result.toString().split(" ");
              this.revision = xrx[0].toString() - 1;
              resolve(this.longpoll());
            })
        });
      })
        });
  } else {
    return new Promise((resolve, reject) => {
      this.getQrFirst().then(async (res) => {
        this._client.getLastOpRevision((err,result)=>{
          let xrx = result.toString().split(" ");
          this.revision = xrx[0].toString() - 1;
          resolve(this.longpoll());
        })
      });
    })
  }
  }
  
  async fetchOps(rev) {
    return this._fetchOps(rev, 5);
  }

  async fetchOperations(rev) {
    return this._fetchOperations(rev, 5);
    
  }

  longpoll() {
    return new Promise((resolve, reject) => {
      this._fetchOperations(this.revision, 50).then((operations) => {
        if (!operations) {
          console.log('No operations');
          reject('No operations');
          return;
        }
        return operations.map((operation) => {
              if(operation.revision.toString() != -1) {
                let revisionNum = operation.revision.toString();
                resolve({ revisionNum, operation });
              }
        });
      });
    });
  }

}

module.exports = LineConnect;
