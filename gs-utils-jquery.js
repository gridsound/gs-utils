"use strict";

function GSUjq( ...args ) {
	return new GSUjqClass( ...args );
}

// .............................................................................
class GSUjqClass {
	#list = [];

	constructor( a, b ) {
		if ( b === undefined ) {
			if ( GSUisStr( a ) ) {
				this.#cstrDomQuery( GSUdomBody, a );
			} else if ( GSUisElm( a ) ) {
				this.#list.push( a );
			} else if ( GSUisArr( a ) ) {
				this.#list = [ ...a ];
			}
		} else if ( GSUisStr( b ) ) {
			if ( GSUisElm( a ) ) {
				this.#cstrDomQuery( a, b );
			} else if ( GSUisArr( a ) ) {
				this.#cstrDomQueries( a, b );
			}
		}
	}
	#cstrDomQuery( elem, sel ) {
		this.#list = GSUdomQSA( elem, sel );
		Object.assign( this, this.#list );
	}
	#cstrDomQueries( elems, sel ) {
		const list = elems.flatMap( el => {
			const arr = [ ...GSUdomQSA( el, sel ) ];

			if ( el.matches( sel ) ) {
				arr.push( el );
			}
			return arr;
		} );

		this.#list = [ ...new Set( list ) ];
		Object.assign( this, this.#list );
	}

	// .........................................................................
	$size() { return this.#list.length; }
	$at( n ) { return this.#list.at( n ); }

	// .........................................................................
	$each( fn ) {
		GSUforEach( this.#list, fn );
		return this;
	}

	// .........................................................................
	$on( ev, fn ) {
		GSUforEach( this.#list, GSUisStr( ev )
			? el => el.addEventListener( ev, fn )
			: el => {
				GSUforEach( ev, ( fn, ev ) => el.addEventListener( ev, fn ) );
			} );
		return this;
	}

	// .........................................................................
	$style( prop, val ) {
		if ( GSUisStr( prop ) && val === undefined ) {
			return GSUdomStyle( this.#list[ 0 ], prop );
		}
		GSUforEach( this.#list, el => GSUdomStyle( el, prop, val ) );
		return this;
	}

	// .........................................................................
	$text( val ) {
		if ( val === undefined ) {
			return this.#list[ 0 ]?.textContent;
		}
		GSUforEach( this.#list, el => el.textContent = val );
		return this;
	}

	// .........................................................................
	$hasAttr( attr ) {
		return this.$attr( attr ) !== null;
	}
	$togAttr( attr ) {
		GSUforEach( this.#list, el => GSUdomTogAttr( el, attr ) );
		return this;
	}
	$attr( attr, val ) {
		if ( val === undefined ) {
			if ( GSUisStr( attr ) ) {
				return GSUdomGetAttr( this.#list[ 0 ], attr );
			}
			if ( GSUisObj( attr ) ) {
				GSUforEach( this.#list, el => GSUdomSetAttr( el, attr ) );
			}
		} else if ( GSUisStr( attr ) ) {
			GSUforEach( this.#list, GSUisFun( val )
				? ( el, i ) => GSUdomSetAttr( el, attr, val( el, i ) )
				: el => GSUdomSetAttr( el, attr, val )
			);
		}
		return this;
	}

	// .........................................................................
	#exec( strFn ) {
		GSUforEach( this.#list, el => el[ strFn ]() );
		return this;
	}
	$play() { return this.#exec( "play" ); }
	$pause() { return this.#exec( "pause" ); }
	$click() { return this.#exec( "click" ); }
}
