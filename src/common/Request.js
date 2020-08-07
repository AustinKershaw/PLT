export default function( url, opts, errMsg, responseType ){
    return fetch( url, opts )
        .then( res => {
            if( res.ok ){ return res[ responseType || "json" ]() };
            throw Error( errMsg );
        });
};
