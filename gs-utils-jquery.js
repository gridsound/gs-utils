"use strict";

function $( ...args ) {
	return new $$( ...args );
}

// .............................................................................
class $$ {
	#a;
	#a0;

	constructor( a, b ) {
		const list = [];

		Object.freeze( this );
		if ( b === undefined ) {
			if ( GSUisElm( a ) ) {
				list.push( a );
			} else if ( GSUisJQu( a ) ) {
				a.$each( el => list.push( el ) );
			} else if ( GSUisArr( a ) ) {
				list.push( ...$$.#extractList( a ) );
			} else if ( GSUisStr( a ) ) {
				a.startsWith( "<" ) && a.endsWith( ">" )
					? list.push( GSUcreateElement( a.slice( 1, -1 ) ) )
					: list.push( ...GSUdomQSA( GSUdomBody, a ) );
			}
		} else if ( GSUisStr( b ) ) {
			if ( GSUisElm( a ) ) {
				list.push( ...GSUdomQSA( a, b ) );
			} else if ( GSUisArr( a ) ) {
				list.push( ...a.flatMap( el => {
					const arr = [ ...GSUdomQSA( el, b ) ];

					if ( el.matches( b ) ) {
						arr.push( el );
					}
					return arr;
				} ) );
			}
		}
		this.#a = !GSUisArr( a ) ? list : [ ...new Set( list ) ];
		this.#a0 = this.#a[ 0 ];
	}

	// .........................................................................
	$size() { return this.#a.length; }
	$at( n ) { return new $$( this.#a.at( n ) ); }
	$get( n ) { return this.#a.at( n ); }
	$some( fn ) { return this.#a.some( fn ); }
	$sort( fn ) { return this.#a.sort( fn ), this; }
	$each( fn ) { return this.#a.forEach( fn ), this; }
	$is( tar ) { return this.$some( GSUisJQu( tar ) ? el => tar.$is( el ) : el => el === tar ); }

	// .........................................................................
	$filter( fn ) { return new $$( this.#a.filter( GSUisFun( fn ) ? fn : el => el.matches( fn ) ) ); }
	$child( n ) { return new $$( this.#a.map( el => Array.prototype.at.call( el.children, n ) ) ); }
	$children() { return new $$( this.#a.flatMap( el => [ ...el.children ] ) ); }
	$find( sel ) { return new $$( this.#a.flatMap( el => [ ...GSUdomQSA( el, sel ) ] ) ); }
	$parent() { return new $$( this.#a.map( el => el.parentNode ) ); }
	$prev() { return new $$( this.#a.map( el => el.previousElementSibling ) ); }
	$next() { return new $$( this.#a.map( el => el.nextElementSibling ) ); }
	$prevUntil( sel ) { return new $$( this.#a.flatMap( el => $$.#siblingUntil( el, "previousElementSibling", sel ) ) ); }
	$nextUntil( sel ) { return new $$( this.#a.flatMap( el => $$.#siblingUntil( el, "nextElementSibling", sel ) ) ); }

	// .........................................................................
	$trigger( s ) { return this.$each( el => el[ s ]() ); }
	$dispatch( ev, ...args ) { return this.$each( el => $$.#dispatch( el, ev, ...args ) ); }
	$prop( str, val ) {
		return val === undefined
			? this.#a0?.[ str ]
			: this.$each( ( el, i ) => el[ str ] = $$.#calcVal( val, el, i ) );
	}

	// .........................................................................
	$on( ev, fn ) {
		return this.$each( GSUisStr( ev )
			? el => $$.#onEvent( el, ev, fn )
			: el => GSUforEach( ev, ( fn, ev ) => $$.#onEvent( el, ev, fn ) ) );
	}
	$off( ...ev ) {
		return this.$each( el => ev.forEach( ev => el[ `on${ ev }` ] = null ) );
	}

	// .........................................................................
	$empty() { return this.$each( GSUdomEmpty ); }
	$remove() { return this.$each( el => el.remove() ); }
	$prepend( ...arr ) { return this.#a0?.prepend( ...$$.#extractList( arr ) ), this; }
	$append( ...arr ) { return this.#a0?.append( ...$$.#extractList( arr ) ), this; }

	// .........................................................................
	$hasClass( c ) { return this.$some( el => el.classList.contains( c ) ); }
	$addClass( ...c ) { return this.$each( el => el.classList.add( ...c ) ); }
	$rmClass( ...c ) { return this.$each( el => el.classList.remove( ...c ) ); }
	$togClass( ...c ) { return this.$each( el => el.classList.toggle( ...c ) ); }

	// .........................................................................
	$hasAttr( k ) { return this.$some( el => el.hasAttribute( k ) ); }
	$togAttr( k ) { return this.$each( el => GSUdomTogAttr( el, k ) ); }
	$rmAttr( ...k ) { return this.$each( el => k.forEach( a => el.removeAttribute( a ) ) ); }
	$addAttr( ...k ) { return this.$each( el => k.forEach( a => el.setAttribute( a, "" ) ) ); }
	$getAttr( ...k ) { return k.length === 1 ? this.#a0?.getAttribute( k[ 0 ] ) || null : k.map( a => this.#a0?.getAttribute( a ) ); }
	$setAttr( k, v ) {
		return this.$each( GSUisObj( k )
			? el => GSUforEach( k, ( v, k ) => $$.#setAttr( el, k, v ) )
			: ( el, i ) => $$.#setAttr( el, k, $$.#calcVal( v, el, i ) ) );
	}

	// .........................................................................
	$top(    n, unit = "px" ) { return n === undefined ? parseFloat( GSUdomStyle( this.#a0, "top" ) )  || 0 : this.$css( "top",  n, unit ); }
	$left(   n, unit = "px" ) { return n === undefined ? parseFloat( GSUdomStyle( this.#a0, "left" ) ) || 0 : this.$css( "left", n, unit ); }
	$width(  n, unit = "px" ) { return n === undefined ? this.#a0?.clientWidth  || 0 : this.$css( "width",  n, unit ); }
	$height( n, unit = "px" ) { return n === undefined ? this.#a0?.clientHeight || 0 : this.$css( "height", n, unit ); }
	$css( prop, val, unit = "" ) {
		return GSUisStr( prop ) && val === undefined
			? GSUdomStyle( this.#a0, prop )
			: this.$each(
				GSUisObj( prop ) ? el => GSUdomStyle( el, prop ) :
				GSUisFun( prop ) ? ( el, i ) => GSUdomStyle( el, prop( el, i ) ) :
				( el, i ) => GSUdomStyle( el, prop, `${ $$.#calcVal( val, el, i ) }${ unit }` )
			);
	}

	// .........................................................................
	$scrollX( n, beh ) { return this.#scroll( "left", n, beh ); }
	$scrollY( n, beh ) { return this.#scroll( "top", n, beh ); }
	#scroll( dir, n, beh ) {
		return this.$each( ( el, i ) => el.scrollTo( {
			[ dir ]: $$.#calcVal( n, el, i ),
			behavior: beh || "auto",
		} ) );
	}

	// .........................................................................
	$tag() { return this.#a0?.tagName.toLowerCase(); }
	$play() { return this.$trigger( "play" ); }
	$pause() { return this.$trigger( "pause" ); }
	$click() { return this.$trigger( "click" ); }
	$text( v ) { return this.$prop( "textContent", v ); }
	$value( v ) { return this.$prop( "value", v ); }
	$viewbox( x, y, w, h ) {
		return this.$setAttr( "viewBox", arguments.length === 4
			? `${ x } ${ y } ${ w } ${ h }`
			: `0 0 ${ x } ${ y }` );
	}

	// .........................................................................
	static #calcVal( val, el, i ) {
		return GSUisFun( val ) ? val( el, i ) : val;
	}
	static #setAttr( el, k, v ) {
		v === false
			? el.removeAttribute( k )
			: el.setAttribute( k, v === true ? "" : v );
	}
	static #extractList( arr ) {
		return arr.reduce( ( arr, el ) => {
			GSUisElm( el )
				? arr.push( el )
				: el?.$each?.( el => arr.push( el ) );
			return arr;
		}, [] );
	}
	static #dispatch( el, ev, ...args ) {
		el.dispatchEvent( new CustomEvent( "gsui", {
			bubbles: true,
			detail: {
				$event: ev,
				$args: args,
				$target: el,
				$targetId: el.dataset.id || null,
			},
		} ) );
	}
	static #siblingUntil( el, dir, sel ) {
		const arr = [];
		let el2 = el[ dir ];

		for ( ; el2 && !el2.matches( sel ); el2 = el2[ dir ] ) {
			arr.push( el2 );
		}
		return arr;
	}
	static #onEvent( el, ev, fn ) {
		const ev2 = `on${ ev }`;

		if ( el[ ev2 ] !== null ) {
			console.warn( `$on, ${ ev2 } is already set`, el[ ev2 ] );
		} else {
			el[ ev2 ] = fn;
		}
	}
}

Object.freeze( $ );
Object.freeze( $$ );
