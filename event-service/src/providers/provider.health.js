class ProviderHealth{

    constructor(){
        this.failures=new Map();
        this.blockedUntil=new Map();
    }

    recordFailure(providerName){

        const count=(this.failures.get(providerName) || 0)+1;
        this.failures.set(providerName,count);


        if(count>=5){

            const coolDown=30000;

            this.blockedUntil.set(providerName,Date.now()+coolDown);

            console.log(`Cicuit opened for ${providerName} for 30 sec`);
        }
    }

    recordSuccess(providerName){
        this.failures.set(providerName,0);
        this.blockedUntil.delete(providerName);
    }

    isAvailable(providerName){

        const blocked=this.blockedUntil.get(providerName);

        if(!blocked)
            return true;

        if(Date.now()>blocked){

            this.blockedUntil.delete(providerName);
            this.failures.set(providerName,0);

            console.log(`Circuit closed for ${providerName}`);

            return true;
        }

        return false;
    }
}

export default new ProviderHealth();