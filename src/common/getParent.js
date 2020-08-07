const getParent = (element, selector) => {
    if(!(element instanceof Element)) return null;
    let immediateParent = element.parentNode;
    let possible = immediateParent.parentNode.querySelectorAll( `*>${ selector }` );
    let result = [...possible].find( item => item === immediateParent );
    let isRoot = immediateParent.nodeName === 'HTML';
    return !possible.length && !result && !isRoot ? getParent( immediateParent, selector ) : !result && isRoot ? null : result ;
};

export default getParent;
