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
			if ( GSUisElm( a ) ) { return this.#constr_elm( a ); }
			if ( GSUisJQu( a ) ) { return this.#constr_jqu( a ); }
			if ( GSUisArr( a ) ) { return this.#constr_arr( a ); }
			if ( GSUisStr( a ) ) {
				return a.startsWith( "<" ) && a.endsWith( ">" )
					? this.#constr_tag( a )
					: this.#constr_sel( a );
			}
		} else if ( GSUisStr( b ) ) {
			if ( GSUisElm( a ) ) { return this.#constr_elm_sel( a, b ); }
			if ( GSUisArr( a ) ) { return this.#constr_arr_sel( a, b ); }
		}
	}
	#constr_tag( tag ) {
		this.#list.push( GSUcreateElement( tag.slice( 1, -1 ) ) );
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
		this.#list = this.#extractList( arr );
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
	$sort( fn ) { return this.#list.sort( fn ), this; }

	// .........................................................................
	$each( fn ) {
		GSUforEach( this.#list, fn );
		return this;
	}

	// .........................................................................
	$filter( fn ) {
		return new GSUjqClass( this.#list.filter( GSUisFun( fn ) ? fn : el => el.matches( fn ) ) );
	}
	$child( n ) {
		return new GSUjqClass( this.#list.map( el => Array.prototype.at.call( el.children, n ) ) );
	}
	$children() {
		return new GSUjqClass( this.#list.flatMap( el => [ ...el.children ] ) );
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
	$css( prop, val, unit = "" ) {
		if ( GSUisObj( prop ) ) {
			GSUforEach( this.#list, el => GSUdomStyle( el, prop ) );
		} else if ( GSUisStr( prop ) ) {
			if ( val === undefined ) {
				return GSUdomStyle( this.#list[ 0 ], prop );
			}
			GSUforEach( this.#list, ( el, i ) => GSUdomStyle( el, prop, `${ GSUjqClass.#calcVal( val, el, i ) }${ unit }` ) );
		}
		return this;
	}
	$top(    n, unit = "px" ) { return n === undefined ? parseFloat( GSUdomStyle( this.#list[ 0 ], "top" ) )  || 0 : this.$css( "top",  n, unit ); }
	$left(   n, unit = "px" ) { return n === undefined ? parseFloat( GSUdomStyle( this.#list[ 0 ], "left" ) ) || 0 : this.$css( "left", n, unit ); }
	$width(  n, unit = "px" ) { return n === undefined ? this.#list[ 0 ]?.clientWidth  || 0 : this.$css( "width",  n, unit ); }
	$height( n, unit = "px" ) { return n === undefined ? this.#list[ 0 ]?.clientHeight || 0 : this.$css( "height", n, unit ); }

	// .........................................................................
	$scrollX( n, beh ) { return this.#scroll( "left", n, beh ); }
	$scrollY( n, beh ) { return this.#scroll( "top", n, beh ); }
	#scroll( dir, n, beh ) {
		GSUforEach( this.#list, ( el, i ) => el.scrollTo( {
			[ dir ]: GSUjqClass.#calcVal( n, el, i ),
			behavior: beh || "auto",
		} ) );
		return this;
	}

	// .........................................................................
	$prepend( ...arr ) { return this.#list[ 0 ]?.prepend( ...this.#extractList( arr ) ), this; }
	$append( ...arr ) { return this.#list[ 0 ]?.append( ...this.#extractList( arr ) ), this; }
	#extractList( arr ) {
		return arr.reduce( ( arr, el ) => {
			GSUisElm( el )
				? arr.push( el )
				: el?.$each?.( el => arr.push( el ) );
			return arr;
		}, [] );
	}

	// .........................................................................
	$text( val ) {
		if ( val === undefined ) {
			return this.#list[ 0 ]?.textContent;
		}
		GSUforEach( this.#list, ( el, i ) => el.textContent = GSUjqClass.#calcVal( val, el, i ) );
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
			GSUforEach( this.#list, ( el, i ) => GSUdomSetAttr( el, attr, GSUjqClass.#calcVal( val, el, i ) ) );
		}
		return this;
	}

	// .........................................................................
	$viewbox( x, y, w, h ) {
		return this.$attr( "viewBox", arguments.length === 4
			? `${ x } ${ y } ${ w } ${ h }`
			: `0 0 ${ x } ${ y }` );
	}

	// .........................................................................
	$value( v ) {
		if ( !arguments.length ) {
			return this.#list[ 0 ]?.value;
		}
		GSUforEach( this.#list, el => el.value = v );
		return this;
	}

	// .........................................................................
	$trigger( s ) {
		GSUforEach( this.#list, el => el[ s ]() );
		return this;
	}
	$play() { return this.$trigger( "play" ); }
	$pause() { return this.$trigger( "pause" ); }
	$click() { return this.$trigger( "click" ); }

	// .........................................................................
	static #calcVal( val, el, i ) {
		return GSUisFun( val ) ? val( el, i ) : val;
	}
}

Object.freeze( GSUjq );
Object.freeze( GSUjqClass );
