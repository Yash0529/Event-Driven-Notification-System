import BaseProvider from './base.provider.js';

export default class SecondaryProvider extends BaseProvider{
    
    constructor(){
        super();
        this.name="secondary";
    }
    async send(notification){
       
        console.log("Fallback Provider sending:",notification.to);

        await new Promise(r=>setTimeout(r,800));

        if(Math.random()<0.15){
            const err=new Error("Secondary Probider Failure");

            err.isRetryable=true;

            throw err;
        }

        return {
            messageId:"secondary-"+Date.now()
        }
    }
}