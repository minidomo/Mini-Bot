'use strict';

module.exports = {
    /**
     * 
     * @param {boolean} withSign 
     */
    generate(withSign = false) {
        let hex = (Math.random() * 0x1000000).toString(16).replace(/(\.[\d\w]+)?$/, '');
        while (hex.length < 6)
            hex = '0' + hex;
        return withSign ? '#' + hex : hex;
    }
};