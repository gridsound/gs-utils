"use strict";

function GSUjq( ...args ) {
	return new GSUjqClass( ...args );
}

// .............................................................................
class GSUjqClass {
	#a;
	#a0;

	constructor( a, b ) {
		const list = [];

		Object.freeze( this );
		if ( b === undefined ) {
			GSUisElm( a ) ? ( this.#constr_elm( list, a ) ) :
			GSUisJQu( a ) ? ( this.#constr_jqu( list, a ) ) :
			GSUisArr( a ) ? ( this.#constr_arr( list, a ) ) :
			GSUisStr( a ) ? ( this.#constr_str( list, a ) ) : null;
		} else if ( GSUisStr( b ) ) {
			GSUisElm( a ) ? ( this.#constr_elm_sel( list, a, b ) ) :
			GSUisArr( a ) ? ( this.#constr_arr_sel( list, a, b ) ) : null;
		}
		this.#a = !GSUisArr( a ) ? list : [ ...new Set( list ) ];
		this.#a0 = this.#a[ 0 ];
	}
	#constr_elm( list, elm ) {
		list.push( elm );
	}
	#constr_jqu( list, jq ) {
		jq.$each( el => list.push( el ) );
	}
	#constr_arr( list, arr ) {
		list.push( ...this.#extractList( arr ) );
	}
	#constr_str( list, str ) {
		str.startsWith( "<" ) && str.endsWith( ">" )
			? this.#constr_tag( list, str )
			: this.#constr_sel( list, str );
	}
	#constr_tag( list, tag ) {
		list.push( GSUcreateElement( tag.slice( 1, -1 ) ) );
	}
	#constr_sel( list, sel ) {
		list.push( ...GSUdomQSA( GSUdomBody, sel ) );
	}
	#constr_elm_sel( list, elm, sel ) {
		list.push( ...GSUdomQSA( elm, sel ) );
	}
	#constr_arr_sel( list, arr, sel ) {
		list.push( ...arr.flatMap( el => {
			const arr = [ ...GSUdomQSA( el, sel ) ];

			if ( el.matches( sel ) ) {
				arr.push( el );
			}
			return arr;
		} ) );
	}

	// .........................................................................
	$size() { return this.#a.length; }
	$at( n ) { return new GSUjqClass( this.#a.at( n ) ); }
	$get( n ) { return this.#a.at( n ); }
	$sort( fn ) { return this.#a.sort( fn ), this; }
	$each( fn ) { return this.#a.forEach( fn ), this; }

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
		return this.$each( GSUisStr( ev )
			? el => el.addEventListener( ev, fn )
			: el => GSUforEach( ev, ( fn, ev ) => el.addEventListener( ev, fn ) ) );
	}

	// .........................................................................
	$css( prop, val, unit = "" ) {
		if ( GSUisObj( prop ) ) {
			return this.$each( el => GSUdomStyle( el, prop ) );
		}
		return val === undefined
			? GSUdomStyle( this.#a0, prop )
			: this.$each( ( el, i ) => GSUdomStyle( el, prop, `${ GSUjqClass.#calcVal( val, el, i ) }${ unit }` ) );
	}
	$top(    n, unit = "px" ) { return n === undefined ? parseFloat( GSUdomStyle( this.#a0, "top" ) )  || 0 : this.$css( "top",  n, unit ); }
	$left(   n, unit = "px" ) { return n === undefined ? parseFloat( GSUdomStyle( this.#a0, "left" ) ) || 0 : this.$css( "left", n, unit ); }
	$width(  n, unit = "px" ) { return n === undefined ? this.#a0?.clientWidth  || 0 : this.$css( "width",  n, unit ); }
	$height( n, unit = "px" ) { return n === undefined ? this.#a0?.clientHeight || 0 : this.$css( "height", n, unit ); }

	// .........................................................................
	$scrollX( n, beh ) { return this.#scroll( "left", n, beh ); }
	$scrollY( n, beh ) { return this.#scroll( "top", n, beh ); }
	#scroll( dir, n, beh ) {
		return this.$each( ( el, i ) => el.scrollTo( {
			[ dir ]: GSUjqClass.#calcVal( n, el, i ),
			behavior: beh || "auto",
		} ) );
	}

	// .........................................................................
	$prepend( ...arr ) { return this.#a0?.prepend( ...this.#extractList( arr ) ), this; }
	$append( ...arr ) { return this.#a0?.append( ...this.#extractList( arr ) ), this; }
	#extractList( arr ) {
		return arr.reduce( ( arr, el ) => {
			GSUisElm( el )
				? arr.push( el )
				: el?.$each?.( el => arr.push( el ) );
			return arr;
		}, [] );
	}

	// .........................................................................
	$empty() { return this.$each( GSUdomEmpty ); }
	$remove() { return this.$each( el => el.remove() ); }

	// .........................................................................
	$hasAttr( k ) { return this.#a.some( el => el.hasAttribute( k ) ); }
	$togAttr( k ) { return this.$each( el => GSUdomTogAttr( el, k ) ); }
	$rmAttr( ...k ) { return this.$each( el => k.forEach( a => el.removeAttribute( a ) ) ); }
	$addAttr( ...k ) { return this.$each( el => k.forEach( a => el.setAttribute( a, "" ) ) ); }
	$getAttr( ...k ) { return k.length === 1 ? this.#a0?.getAttribute( k[ 0 ] ) || null : k.map( a => this.#a0?.getAttribute( a ) ); }
	$setAttr( k, v ) {
		return this.$each( GSUisObj( k )
			? el => GSUforEach( k, ( v, k ) => GSUjqClass.#setAttr( el, k, v ) )
			: ( el, i ) => GSUjqClass.#setAttr( el, k, GSUjqClass.#calcVal( v, el, i ) ) );
	}

	// .........................................................................
	$hasClass( c ) { return this.#a.some( el => el.classList.contains( c ) ); }
	$addClass( ...c ) { return this.$each( el => el.classList.add( ...c ) ); }
	$rmClass( ...c ) { return this.$each( el => el.classList.remove( ...c ) ); }
	$togClass( ...c ) { return this.$each( el => el.classList.toggle( ...c ) ); }

	// .........................................................................
	$viewbox( x, y, w, h ) {
		return this.$attr( "viewBox", arguments.length === 4
			? `${ x } ${ y } ${ w } ${ h }`
			: `0 0 ${ x } ${ y }` );
	}

	// .........................................................................
	$prop( str, val ) {
		return val === undefined
			? this.#a0?.[ str ]
			: this.$each( ( el, i ) => el[ str ] = GSUjqClass.#calcVal( val, el, i ) );
	}
	$text( v ) { return this.$prop( "textContent", v ); }
	$value( v ) { return this.$prop( "value", v ); }

	// .........................................................................
	$trigger( s ) { return this.$each( el => el[ s ]() ); }
	$play() { return this.$trigger( "play" ); }
	$pause() { return this.$trigger( "pause" ); }
	$click() { return this.$trigger( "click" ); }

	// .........................................................................
	$dispatch( ev, ...args ) { return this.$each( el => GSUdomDispatch( el, ev, ...args ) ); }

	// .........................................................................
	static #calcVal( val, el, i ) {
		return GSUisFun( val ) ? val( el, i ) : val;
	}
	static #setAttr( el, k, v ) {
		v === false
			? el.removeAttribute( k )
			: el.setAttribute( k, v === true ? "" : v );
	}
}

Object.freeze( GSUjq );
Object.freeze( GSUjqClass );
