import Request from './../common/Request';

export default class Product {
    get(){
        return Request( `https://my-json-server.typicode.com/benirvingplt/products/products` );
    }
};
