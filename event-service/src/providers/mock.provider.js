import BaseProvider from './base.provider.js';

export default class MockProvider extends BaseProvider{
    
    constructor(){
        super();
        this.name="primary";
    }
    async send(notification){

        console.log("Primary Provider sending:",notification.to);

        await new Promise(r=>setTimeout(r,1000));

        const r=Math.random();

        if(r<0.4){
            const err=new Error("Provider down");

            err.isRetryable=true;

            throw err;
        }

        if(r<0.5){
            const err=new Error("Invalid Email");

            err.isRetryable=false;

            throw err;
        }

        return {
            messageId: "mock-"+Date.now()
        }
    }
};
