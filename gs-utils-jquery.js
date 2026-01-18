"use strict";

function GSUjq( ...args ) {
	return new GSUjqClass( ...args );
}

// .............................................................................
class GSUjqClass {
	#list = [];

	constructor( a, b ) {
		Object.freeze( this );
		if ( b === undefined ) {
			if ( GSUisStr( a ) ) { return this.#constr_sel( a ); }
			if ( GSUisElm( a ) ) { return this.#constr_elm( a ); }
			if ( GSUisJQu( a ) ) { return this.#constr_jqu( a ); }
			if ( GSUisArr( a ) ) { return this.#constr_arr( a ); }
		} else if ( GSUisStr( b ) ) {
			if ( GSUisElm( a ) ) { return this.#constr_elm_sel( a, b ); }
			if ( GSUisArr( a ) ) { return this.#constr_arr_sel( a, b ); }
		}
	}
	#constr_sel( sel ) {
		this.#list = [ ...GSUdomQSA( GSUdomBody, sel ) ];
	}
	#constr_elm( el ) {
		this.#list.push( el );
	}
	#constr_jqu( jq ) {
		jq.$each( el => this.#list.push( el ) );
	}
	#constr_arr( arr ) {
		GSUforEach( arr, el => {
			if ( GSUisElm( el ) ) {
				this.#list.push( el );
			} else if ( GSUisJQu( el ) ) {
				el.$each( el => this.#list.push( el ) );
			}
		} );
		this.#cleanList();
	}
	#constr_elm_sel( el, sel ) {
		this.#list = [ ...GSUdomQSA( el, sel ) ];
	}
	#constr_arr_sel( elems, sel ) {
		this.#list = elems.flatMap( el => {
			const arr = [ ...GSUdomQSA( el, sel ) ];

			if ( el.matches( sel ) ) {
				arr.push( el );
			}
			return arr;
		} );
		this.#cleanList();
	}
	#cleanList() {
		return this.#list = [ ...new Set( this.#list ) ];
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
	$filter( fn ) {
		return new GSUjqClass( this.#list.filter( fn ) );
	}
	$child( n ) {
		return new GSUjqClass( this.#list.map( el => el.children[ n ] ) );
	}
	$find( sel ) {
		const list = this.#list.flatMap( el => [ ...GSUdomQSA( el, sel ) ] );

		return new GSUjqClass( [ ...new Set( list ) ] );
	}

	// .........................................................................
	$on( ev, fn ) {
		GSUforEach( this.#list, GSUisStr( ev )
			? el => el.addEventListener( ev, fn )
			: el => GSUforEach( ev, ( fn, ev ) => el.addEventListener( ev, fn ) ) );
		return this;
	}

	// .........................................................................
	$css( prop, val ) {
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
	$empty() {
		GSUforEach( this.#list, GSUdomEmpty );
		return this;
	}
	$remove() {
		GSUforEach( this.#list, el => el.remove() );
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

Object.freeze( GSUjq );
Object.freeze( GSUjqClass );
