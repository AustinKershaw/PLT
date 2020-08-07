export default function(){
    const date = new Date();
    const doubleDigit = val => val < 
    10 ? `0${ val }` : val;
    return `${ date.getFullYear() }-${ doubleDigit( date.getMonth() ) }-${ doubleDigit( date.getDate() ) } ${ date.getHours() }:${ date.getMinutes() }:${ date.getSeconds() }`;
};
