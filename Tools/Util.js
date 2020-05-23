class Util
{

    static generateId(){
        const { v1: uuid } = require('uuid');
        return uuid();
    }

}

module.exports = Util;