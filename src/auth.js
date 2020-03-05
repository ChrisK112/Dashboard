class Auth{
    constructor(){

        this.authernticated = false;

    }

    login(cb){

        this.authernticated = true;
        cb();
    }

    logout(cb){
        this.authernticated = false;
        cb();
    }

    isAuthenticated(){

        return this.authernticated();

    }
}

export default new Auth()