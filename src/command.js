const LineAPI = require('./api');

let exec = require('child_process').exec;

class Command extends LineAPI {

    constructor() {
        super();
        this.spamName = [];
    }

    get payload() {
        if(typeof this.messages !== 'undefined'){
            return (this.messages.text !== null) ? this.messages.text.split(' ').splice(1) : '' ;
        }
        return false;
    }

    async searchGroup(gid) {
        let listPendingInvite = [];
        let thisgroup = await this._getGroups([gid]);
        if(thisgroup[0].invitee !== null) {
            listPendingInvite = thisgroup[0].invitee.map((key) => {
                return key.mid;
            });
        }
        let listMember = thisgroup[0].members.map((key) => {
            return { mid: key.mid, dn: key.displayName };
        });
        return { 
            listMember,
            listPendingInvite
        }
    }

    async getSpeed() {
        let curTime = Date.now() / 1000;
        await this._sendMessage(this.messages, 'Read Time');
        const rtime = (Date.now() / 1000) - curTime;
        await this._sendMessage(this.messages, `${rtime} Second`);
        return;
    }

    async kickAll() {
        let groupID;
        if(this.stateStatus.kick == 1) {
            //let updateGroup = await this._getGroup(this.messages.to);
            //updateGroup.name = '愛愛降臨';
            //await this._updateGroup(updateGroup);
            //let msg = {
                //text:null,
                //contentType: 13,
                //contentPreview: null,
                //contentMetadata: 
                //{ mid: 'u085311ecd9e3e3d74ae4c9f5437cbcb5' }
            //}
            //Object.assign(this.messages,msg);
            //this._sendMessage(this.messages);
            let { listMember } = await this.searchGroup(this.messages.to);
            for (var i = 0; i < listMember.length; i++) {
                if(!this.isAdminOrBot(listMember[i].mid)){
                    this._kickMember(this.messages.to,[listMember[i].mid])
                }
            }
            return;
        } 
        return this._sendMessage(this.messages, '愛你們💋');
    }
}

module.exports = Command;
