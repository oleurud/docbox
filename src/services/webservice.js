import $ from 'jquery';
import config from '../config';

let webService = {
    doCall: (method, url, parameters, headers, callback) => {
        $.ajax({
            method: method,
            url: config.sourceURL + url,
            data: parameters,
            headers: headers
        })
        .done(function( response ) {
            if(response.status && response.data) {
                callback(null, response.data);
            } else {
                callback(true, response.data ? response.data : 'Something was wrong');
            }
        })
        .fail(function( response ) {
            callback(true, response.data ? response.data : 'Something was wrong');
        });
    }
};

export default webService;
