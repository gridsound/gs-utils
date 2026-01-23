"use strict";

function GSUjq( ...args ) {
	return new GSUjqClass( ...args );
}

// .............................................................................
class GSUjqClass {
	#a = [];

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
		this.#a.push( GSUcreateElement( tag.slice( 1, -1 ) ) );
	}
	#constr_sel( sel ) {
		this.#a = [ ...GSUdomQSA( GSUdomBody, sel ) ];
	}
	#constr_elm( el ) {
		this.#a.push( el );
	}
	#constr_jqu( jq ) {
		jq.$each( el => this.#a.push( el ) );
	}
	#constr_arr( arr ) {
		this.#a = this.#extractList( arr );
		this.#cleanList();
	}
	#constr_elm_sel( el, sel ) {
		this.#a = [ ...GSUdomQSA( el, sel ) ];
	}
	#constr_arr_sel( elems, sel ) {
		this.#a = elems.flatMap( el => {
			const arr = [ ...GSUdomQSA( el, sel ) ];

			if ( el.matches( sel ) ) {
				arr.push( el );
			}
			return arr;
		} );
		this.#cleanList();
	}
	#cleanList() {
		return this.#a = [ ...new Set( this.#a ) ];
	}

	// .........................................................................
	$size() { return this.#a.length; }
	$at( n ) { return new GSUjqClass( this.#a.at( n ) ); }
	$get( n ) { return this.#a.at( n ); }
	$sort( fn ) { return this.#a.sort( fn ), this; }

	// .........................................................................
	$each( fn ) {
		GSUforEach( this.#a, fn );
		return this;
	}

	// .........................................................................
	$filter( fn ) {
		return new GSUjqClass( this.#a.filter( GSUisFun( fn ) ? fn : el => el.matches( fn ) ) );
	}
	$child( n ) {
		return new GSUjqClass( this.#a.map( el => Array.prototype.at.call( el.children, n ) ) );
	}
	$children() {
		return new GSUjqClass( this.#a.flatMap( el => [ ...el.children ] ) );
	}
	$find( sel ) {
		const list = this.#a.flatMap( el => [ ...GSUdomQSA( el, sel ) ] );

		return new GSUjqClass( [ ...new Set( list ) ] );
	}

	// .........................................................................
	$on( ev, fn ) {
		GSUforEach( this.#a, GSUisStr( ev )
			? el => el.addEventListener( ev, fn )
			: el => GSUforEach( ev, ( fn, ev ) => el.addEventListener( ev, fn ) ) );
		return this;
	}

	// .........................................................................
	$css( prop, val, unit = "" ) {
		if ( GSUisObj( prop ) ) {
			GSUforEach( this.#a, el => GSUdomStyle( el, prop ) );
		} else if ( GSUisStr( prop ) ) {
			if ( val === undefined ) {
				return GSUdomStyle( this.#a[ 0 ], prop );
			}
			GSUforEach( this.#a, ( el, i ) => GSUdomStyle( el, prop, `${ GSUjqClass.#calcVal( val, el, i ) }${ unit }` ) );
		}
		return this;
	}
	$top(    n, unit = "px" ) { return n === undefined ? parseFloat( GSUdomStyle( this.#a[ 0 ], "top" ) )  || 0 : this.$css( "top",  n, unit ); }
	$left(   n, unit = "px" ) { return n === undefined ? parseFloat( GSUdomStyle( this.#a[ 0 ], "left" ) ) || 0 : this.$css( "left", n, unit ); }
	$width(  n, unit = "px" ) { return n === undefined ? this.#a[ 0 ]?.clientWidth  || 0 : this.$css( "width",  n, unit ); }
	$height( n, unit = "px" ) { return n === undefined ? this.#a[ 0 ]?.clientHeight || 0 : this.$css( "height", n, unit ); }

	// .........................................................................
	$scrollX( n, beh ) { return this.#scroll( "left", n, beh ); }
	$scrollY( n, beh ) { return this.#scroll( "top", n, beh ); }
	#scroll( dir, n, beh ) {
		GSUforEach( this.#a, ( el, i ) => el.scrollTo( {
			[ dir ]: GSUjqClass.#calcVal( n, el, i ),
			behavior: beh || "auto",
		} ) );
		return this;
	}

	// .........................................................................
	$prepend( ...arr ) { return this.#a[ 0 ]?.prepend( ...this.#extractList( arr ) ), this; }
	$append( ...arr ) { return this.#a[ 0 ]?.append( ...this.#extractList( arr ) ), this; }
	#extractList( arr ) {
		return arr.reduce( ( arr, el ) => {
			GSUisElm( el )
				? arr.push( el )
				: el?.$each?.( el => arr.push( el ) );
			return arr;
		}, [] );
	}

	// .........................................................................
	$empty() {
		GSUforEach( this.#a, GSUdomEmpty );
		return this;
	}
	$remove() {
		GSUforEach( this.#a, el => el.remove() );
		return this;
	}

	// .........................................................................
	$hasAttr( attr ) { return this.#a.some( el => el.hasAttribute( attr ) ); }
	$togAttr( attr ) { return this.#a.forEach( el => GSUdomTogAttr( el, attr ) ), this; }
	$rmAttr( ...attrs ) { return this.#a.forEach( el => attrs.forEach( a => el.removeAttribute( a ) ) ), this; }
	$addAttr( ...attrs ) { return this.#a.forEach( el => attrs.forEach( a => el.setAttribute( a, "" ) ) ), this; }
	$attr( attr, val ) {
		if ( val === undefined ) {
			if ( GSUisStr( attr ) ) {
				return GSUdomGetAttr( this.#a[ 0 ], attr );
			}
			if ( GSUisObj( attr ) ) {
				GSUforEach( this.#a, el => GSUdomSetAttr( el, attr ) );
			}
		} else if ( GSUisStr( attr ) ) {
			GSUforEach( this.#a, ( el, i ) => GSUdomSetAttr( el, attr, GSUjqClass.#calcVal( val, el, i ) ) );
		}
		return this;
	}

	// .........................................................................
	$hasClass( clazz ) { return this.#a.some( el => el.classList.contains( clazz ) ); }
	$addClass( ...clazzes ) { return this.#a.forEach( el => el.classList.add( ...clazzes ) ), this; }
	$rmClass( ...clazzes ) { return this.#a.forEach( el => el.classList.remove( ...clazzes ) ), this; }
	$togClass( ...attr ) { return this.#a.forEach( el => el.classList.toggle( ...attr ) ), this; }

	// .........................................................................
	$viewbox( x, y, w, h ) {
		return this.$attr( "viewBox", arguments.length === 4
			? `${ x } ${ y } ${ w } ${ h }`
			: `0 0 ${ x } ${ y }` );
	}

	// .........................................................................
	$prop( str, val ) {
		if ( val === undefined ) {
			return this.#a[ 0 ]?.[ str ];
		}
		GSUforEach( this.#a, ( el, i ) => el[ str ] = GSUjqClass.#calcVal( val, el, i ) );
		return this;
	}
	$text( v ) { return this.$prop( "textContent", v ); }
	$value( v ) { return this.$prop( "value", v ); }

	// .........................................................................
	$trigger( s ) {
		GSUforEach( this.#a, el => el[ s ]() );
		return this;
	}
	$play() { return this.$trigger( "play" ); }
	$pause() { return this.$trigger( "pause" ); }
	$click() { return this.$trigger( "click" ); }

	// .........................................................................
	$dispatch( ev, ...args ) {
		GSUforEach( this.#a, el => GSUdomDispatch( el, ev, ...args ) );
		return this;
	}

	// .........................................................................
	static #calcVal( val, el, i ) {
		return GSUisFun( val ) ? val( el, i ) : val;
	}
}

Object.freeze( GSUjq );
Object.freeze( GSUjqClass );
