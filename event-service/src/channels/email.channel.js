import BaseChannel from './base.channel.js';
import providerManager from '../providers/provider.manager.js';

export default class EmailChannel extends BaseChannel{

    async send(notification){

        console.log("Sending Email to",notitication.to);
        return providerManager.send(notification);
    }
}