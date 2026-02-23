import BaseChannel from './base.channel.js';

export default class PushChannel extends BaseChannel{

    async send(notification){

        console.log("Sending PUSH notification to ",notification.to);

        await new Promise(r=>setTimeout(r,300));

        return {
            messageId:"push-"+Date.now()
        }
    }
}