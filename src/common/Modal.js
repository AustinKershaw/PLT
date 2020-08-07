
export default function( opts ){
    return new Promise(( resolve, reject ) => {

        const modal = document.querySelector( '#modal' );
        const title = modal.querySelector( '.title' );
        const description = modal.querySelector( '.description' );
        const confirm = modal.querySelector( '.confirm-link' );
        const cancel = modal.querySelector( '.cancel-link' );

        
        const cb = condition => {
            modal.classList.remove( 'active' );
            title.innerText = "";
            description.innerText = "";
            confirm.removeEventListener( "click", trueCb );
            cancel.removeEventListener( "click", falseCb );
            resolve( condition );
        };
        const falseCb = evt => (evt.preventDefault(), cb( false ));
        const trueCb = evt => (evt.preventDefault(), cb( true ));

        title.innerText = (opts.title || "");
        description.innerText = (opts.description || "");
        confirm.addEventListener( "click", trueCb );
        cancel.addEventListener( "click", falseCb );
        modal.classList.add( 'active' );
    });
};
