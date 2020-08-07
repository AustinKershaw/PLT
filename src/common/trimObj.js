export default function trimObj( obj, include ){
    obj = JSON.parse( JSON.stringify( obj ) );
    Object.keys( obj ).forEach( key => {
        if( include.indexOf( key ) === -1 ){
            delete obj[ key ];
        };
    });
    return obj;
};
