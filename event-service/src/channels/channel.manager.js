import EmailChannel from './email.channel.js';
import SMSChannel from './sms.channel.js';
import PushChannel from './push.channel.js';

class ChannelManager{

    constructor(){
        this.channels={
            EMAIL:new EmailChannel(),
            SMS:new SMSChannel(),
            PUSH:new PushChannel()
        }
    }

    async send(channel,notification){

        const handler=this.channels[channel];

        if(!handler){
            throw new Error("Unsupported channel");
        }

        return handler.send(notification);
    }
}

export default new ChannelManager();