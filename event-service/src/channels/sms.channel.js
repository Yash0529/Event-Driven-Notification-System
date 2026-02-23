import BaseChannel from './base.channel.js';

export default class SMSChannel extends BaseChannel{

    async send(notification){

        console.log("Sending SMS to ",notification.to);

        await new Promise(r=>setTimeout(r,500));

        return {
            messageId:"sms-"+Date.now()
        };
    }
}