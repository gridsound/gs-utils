"use strict";

function $( a, b ) {
	if ( b !== undefined ) {
		console.warn( "⚠️ $() constructor deprecated", [ a, b ] );
	}
	return GSUisJQu( a ) ? a : new $$( a );
}

// .............................................................................
$.$htmlNS = "http://www.w3.org/1999/xhtml";
$.$svgNS = "http://www.w3.org/2000/svg";
$.$taglistSVG = Object.freeze( {
	g: 1,
	svg: 1,
	use: 1,
	defs: 1,
	line: 1,
	path: 1,
	rect: 1,
	stop: 1,
	circle: 1,
	polygon: 1,
	polyline: 1,
	linearGradient: 1,
} );

// .............................................................................
$.$templates = new Map();
$.$hasTemplate = id => $.$templates.has( id );
$.$setTemplate = ( id, fn ) => $.$templates.set( id, fn );
$.$getTemplate = ( id, ...a ) => $.$templates.get( id )( ...a );
$.$define = ( tag, clazz ) => {
	Object.freeze( clazz );
	customElements.define( tag, clazz );
};

// .............................................................................
$.$rmAttr = ( el, k ) => el.removeAttribute( k );
$.$hasAttr = ( el, k ) => el.hasAttribute( k );
$.$setAttr = ( el, k, v ) => el.setAttribute( k, v );
$.$togAttr = ( el, k ) => $.$setAttr2( el, k, !$.$hasAttr( el, k ) );
$.$setAttr2 = ( el, k, v ) => {
	v === false || v === null || v === undefined
		? $.$rmAttr( el, k )
		: $.$setAttr( el, k, v === true ? "" : v );
};

// .............................................................................
$.$qSA = ( sel, el = document ) => el.querySelectorAll( sel );
$.$getElemByPoint = ( x, y ) => $( document.elementFromPoint( x, y ) );
$.$css = ( el, prop, val ) => $$.$setStyle( el, prop, val );
$.$prev = el => el.previousElementSibling;
$.$next = el => el.nextElementSibling;
$.$unselect = () => window.getSelection().removeAllRanges();
$.$bcr = el => {
	if ( el ) {
		const bcr = el.getBoundingClientRect();

		bcr.w = bcr.width;
		bcr.h = bcr.height;
		return bcr;
	}
};
$.$isScrollable = el => {
	const ov = $.$css( el, "overflow" );

	return ov === "auto" || ov === "scroll";
};

// .............................................................................
$.$elem = ( tag, attr, ...children ) => {
	const el = document.createElementNS( tag in $.$taglistSVG ? $.$svgNS : $.$htmlNS, tag );

	GSUforEach( attr, ( val, k ) => $.$setAttr2( el, k, val ) );
	el.append( ...children.flat( 1 ).filter( ch => Boolean( ch ) || Number.isFinite( ch ) ) );
	return el;
};
$.$icon = attr => {
	const attr2 = {
		inert: true,
		...attr,
		class: `gsuiIcon${ attr?.class ? ` ${ attr.class }` : "" }`,
		"data-icon": attr?.icon || null,
		"data-spin": attr?.spin ? "on" : null,
	};

	delete attr2.icon;
	return $.$elem( "i", attr2 );
};
$.$button = ( attr, ...child ) => {
	const attr2 = {
		type: "button",
		...attr,
		class: `${ attr?.class || "" }${ attr?.icon ? " gsuiIcon" : "" }` || null,
		"data-icon": attr?.icon || null,
	};

	delete attr2.icon;
	return $.$elem( "button", attr2, ...child );
};
$.$div = $.$elem.bind( null, "div" );
$.$bold = $.$elem.bind( null, "b" );
$.$flex = $.$elem.bind( null, "gs-flex" );
$.$span = $.$elem.bind( null, "span" );
$.$input = $.$elem.bind( null, "input" );
$.$label = $.$elem.bind( null, "label" );
$.$select = $.$elem.bind( null, "select" );
$.$option  = ( a, c ) => $.$elem( "option", a, c || a?.value );
$.$link    = ( a, ...c ) => $.$elem( "a", { href: true, ...a }, ...c );
$.$linkExt = ( a, ...c ) => $.$elem( "a", { href: true, ...a, target: "_blank", rel: "noopener" }, ...c );

// .............................................................................
class $$ {
	#a;
	#a0;

	constructor( a ) {
		const list = [];

		Object.freeze( this );
		if ( GSUisElm( a ) ) {
			list.push( a );
		} else if ( GSUisArr( a ) ) {
			list.push( ...$$.#extractList( a ) );
		} else if ( GSUisStr( a ) ) {
			a.startsWith( "<" ) && a.endsWith( ">" )
				? list.push( $.$elem( a.slice( 1, -1 ) ) )
				: list.push( ...$.$qSA( a ) );
		}
		this.#a = !GSUisArr( a ) ? list : [ ...new Set( list ) ];
		this.#a0 = this.#a[ 0 ];
	}

	// .........................................................................
	$is( tar ) {
		return this.$some(
			GSUisElm( tar ) ? el => el === tar :
			GSUisJQu( tar ) ? el => tar.$is( el ) :
			GSUisStr( tar ) ? el => el.matches( tar ) : GSUnoopFalse
		);
	}

	// .........................................................................
	$size() { return this.#a.length; }
	$at( n ) { return $( this.#a.at( n ) ); }
	$get( n ) { return this.#a.at( n ); }
	$map( fn ) { return this.#a.map( fn ); }
	$some( fn ) { return this.#a.some( fn ); }
	$sort( fn ) { return this.#a.sort( fn ), this; }
	$each( fn ) { return this.#a.forEach( fn ), this; }
	$find( fn ) { return $( this.#a.find( fn ) ); }
	$findIndex( fn ) { return this.#a.findIndex( fn ); }
	$reduce( fn, x ) { return this.#a.reduce( fn, x ); }
	$contains( tar ) { return this.$some( el => el.contains( $$.#extractFirst( tar ) ) ); }
	$index() {
		return this.#a0?.parentNode
			? Array.prototype.indexOf.call( this.#a0?.parentNode.children, this.#a0 )
			: -1;
	}

	// .........................................................................
	$filter( fn ) { return $( this.#a.filter( GSUisFun( fn ) ? fn : el => el.matches( fn ) ) ); }
	$child( n ) { return $( this.#a.map( el => Array.prototype.at.call( el.children, n ) ) ); }
	$children() { return $( this.#a.flatMap( el => [ ...el.children ] ) ); }
	$parent( n ) { return $( this.#a.map( el => $$.#parent( el, n ) ) ); }
	$closest( sel ) { return $( this.#a.map( el => el.closest( sel ) ) ); }
	$closestScrollable() { return $( this.#a.map( el => $$.#closestScrollable( el ) ) ); }
	$prev() { return $( this.#a.map( $.$prev ) ); }
	$next() { return $( this.#a.map( $.$next ) ); }
	$prevUntil( sel ) { return $( this.#a.flatMap( el => $$.#siblingUntil( el, $.$prev, sel ) ) ); }
	$nextUntil( sel ) { return $( this.#a.flatMap( el => $$.#siblingUntil( el, $.$next, sel ) ) ); }
	$query( sel ) { return $( this.#a.flatMap( el => [ ...$.$qSA( sel, el ) ] ) ); }

	// .........................................................................
	$queryMap( graph ) {
		return GSUreduce( graph, ( obj, sel, key ) => {
			obj[ key ] = $( [ this.$filter( sel ), this.$query( sel ) ] );
			if ( !obj[ key ].$size() ) {
				console.warn( "$queryMap: empty query", [ key, sel ] );
			}
			return obj;
		}, {} );
	}

	// .........................................................................
	$trigger( s ) { return this.$each( el => el[ s ]() ); }
	$dispatch( ev, ...args ) { return this.$each( el => $$.#dispatch( el, ev, ...args ) ); }

	// .........................................................................
	$message( ev, ...args ) {
		let ret;

		this.$some( el => {
			ret = el.$onmessage?.( ev, ...args );
			if ( ret !== undefined ) {
				return true;
			}
		} );
		return ret !== undefined ? ret : this;
	}
	$on( ev, fn ) {
		return this.$each( GSUisStr( ev )
			? el => $$.#onEvent( el, ev, fn )
			: el => GSUforEach( ev, ( fn, ev ) => $$.#onEvent( el, ev, fn ) ) );
	}
	$off( ...ev ) {
		return this.$each( el => ev.forEach( ev => el[ `on${ ev }` ] = null ) );
	}
	$addEventListener( ev, fn, opt ) { return this.$each( el => el.addEventListener( ev, fn, opt ) ); }
	$rmEventListener( ev, fn ) { return this.$each( el => el.removeEventListener( ev, fn ) ); }
	$setPtrCapture( ptrId ) { return this.#a0?.setPointerCapture( ptrId ), this; }
	$relPtrCapture( ptrId ) { return this.#a0?.releasePointerCapture( ptrId ), this; }
	$listen( cbs ) { return this.$addEventListener( "gsui", $$.#listenCB.bind( null, cbs ) ); }
	static #listenCB( cbs, e ) {
		const d = e.detail;
		const fn = cbs[ d.$event ];

		if ( fn && fn( d, ...d.$args ) !== true ) {
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	}

	// .........................................................................
	$empty() { return this.$each( $$.#empty ); }
	$remove() { return this.$each( el => el.remove() ); }
	$prepend( ...arr ) { return this.#a0?.prepend( ...$$.#extractList( arr ) ), this; }
	$append( ...arr ) { return this.#a0?.append( ...$$.#extractList( arr ) ), this; }
	$prependTo( el ) { return $$.#extractFirst( el )?.prepend( ...this.#a ), this; }
	$appendTo( el ) { return $$.#extractFirst( el )?.append( ...this.#a ), this; }

	// .........................................................................
	$hasClass( c ) { return this.$some( el => el.classList.contains( c ) ); }
	$addClass( ...c ) { return this.$each( el => el.classList.add( ...c ) ); }
	$rmClass( ...c ) { return this.$each( el => el.classList.remove( ...c ) ); }
	$togClass( ...c ) { return this.$each( el => el.classList.toggle( ...c ) ); }

	// .........................................................................
	$hasAttr( k ) { return this.$some( el => $.$hasAttr( el, k ) ); }
	$togAttr( k ) { return this.$each( el => $.$togAttr( el, k ) ); }
	$rmAttr( ...k ) { return this.$each( el => k.forEach( a => $.$rmAttr( el, a ) ) ); }
	$addAttr( ...k ) { return this.$each( el => k.forEach( a => $.$setAttr( el, a, "" ) ) ); }
	$getAttr( ...k ) { return k.length === 1 ? this.#a0?.getAttribute( k[ 0 ] ) ?? null : k.map( a => this.#a0?.getAttribute( a ) ); }
	$setAttr( k, v ) {
		return this.$each( GSUisObj( k )
			? el => GSUforEach( k, ( v, k ) => $.$setAttr2( el, k, v ) )
			: GSUisFun( k )
				? ( el, i ) => GSUforEach( k( el, i ), ( v, k ) => $.$setAttr2( el, k, v ) )
				: ( el, i ) => $.$setAttr2( el, k, $$.#calcVal( v, el, i ) )
		);
	}

	// .........................................................................
	$prop( str, val ) {
		return val === undefined
			? this.#a0?.[ str ]
			: this.$each( ( el, i ) => el[ str ] = $$.#calcVal( val, el, i ) );
	}
	$dataset( k, v ) {
		return v === undefined
			? this.#a0?.dataset[ k ] ?? null
			: this.$each( el => el.dataset[ k ] = v );
	}

	// .........................................................................
	$top(    n, unit ) { return n === undefined ? parseFloat( $$.$setStyle( this.#a0, "top" ) )  || 0 : this.$css( "top",  n, unit ); }
	$left(   n, unit ) { return n === undefined ? parseFloat( $$.$setStyle( this.#a0, "left" ) ) || 0 : this.$css( "left", n, unit ); }
	$width(  n, unit ) { return n === undefined ? this.#a0?.clientWidth  || 0 : this.$css( "width",  n, unit ); }
	$height( n, unit ) { return n === undefined ? this.#a0?.clientHeight || 0 : this.$css( "height", n, unit ); }
	$css( prop, val, unit = "" ) {
		return ( GSUisStr( prop ) || prop === undefined ) && val === undefined
			? this.#a0 && $$.$setStyle( this.#a0, prop )
			: this.$each(
				GSUisObj( prop ) ? el => $$.$setStyle( el, prop ) :
				GSUisFun( prop ) ? ( el, i ) => $$.$setStyle( el, prop( el, i ) ) :
				( el, i ) => $$.$setStyle( el, prop, `${ $$.#calcVal( val, el, i ) }${ unit }` )
			);
	}

	// .........................................................................
	$scrollW() { return this.#a0?.scrollWidth; }
	$scrollH() { return this.#a0?.scrollHeight; }
	$scrollX( n, beh ) { return n === undefined ? this.#a0?.scrollLeft : this.#scroll( "left", n, beh ); }
	$scrollY( n, beh ) { return n === undefined ? this.#a0?.scrollTop : this.#scroll( "top", n, beh ); }
	$scrollIntoViewX( par ) { return $$.#scrollIntoViewX( this.#a0, GSUisJQu( par ) ? par.$get( 0 ) : par ), this; }
	$scrollIntoViewX( par ) { return $$.#scrollIntoViewX( this.#a0, $$.#extractFirst( par ) ), this; }
	#scroll( dir, n, beh ) {
		return this.$each( ( el, i ) => el.scrollTo( {
			[ dir ]: $$.#calcVal( n, el, i ),
			behavior: beh || "auto",
		} ) );
	}

	// .........................................................................
	$onclick( fn ) { return this.$on( "click", fn ); }
	$oninput( fn ) { return this.$on( "input", fn ); }
	$onchange( fn ) { return this.$on( "change", fn ); }

	// .........................................................................
	$play() { return this.$trigger( "play" ); }
	$pause() { return this.$trigger( "pause" ); }
	$click() { return this.$trigger( "click" ); }

	// .........................................................................
	$bcr() { return $.$bcr( this.#a0 ); }
	$tag() { return this.#a0?.tagName.toLowerCase(); }
	$focus() { return this.#a0?.focus( { preventScroll: true } ); }
	$text( v ) { return this.$prop( "textContent", v ); }
	$value( v ) { return this.$prop( "value", v ); }
	$checked( b ) { return this.$prop( "checked", b ); }
	$disabled( b ) { return this.$setAttr( "disabled", b ); }
	$dataId( id ) { return this.$dataset( "id", id ); }
	$dataProp( v ) { return this.$dataset( "prop", v ); }
	$viewbox( x, y, w, h ) {
		return this.$setAttr( "viewBox", arguments.length === 4
			? `${ x } ${ y } ${ w } ${ h }`
			: `0 0 ${ x } ${ y }` );
	}

	// .........................................................................
	static #calcVal( val, el, i ) {
		return GSUisFun( val ) ? val( el, i ) : val;
	}
	static #empty( el ) {
		while ( el.lastChild ) {
			el.lastChild.remove();
		}
	}
	static #parent( el, n = 1 ) {
		let el2 = el;
		let n2 = n;

		while ( el2 && --n2 >= 0 ) {
			el2 = el2.parentNode;
		}
		return el2;
	}
	static #extractFirst( el ) {
		return GSUisJQu( el ) ? el?.#a0 : el;
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
				$target: $( el ),
				$targetId: el.dataset.id || null,
			},
		} ) );
	}
	static #siblingUntil( el, fnDir, sel ) {
		const arr = [];
		let el2 = fnDir( el );

		for ( ; el2 && !el2.matches( sel ); el2 = fnDir( el2 ) ) {
			arr.push( el2 );
		}
		return arr;
	}
	static #onEvent( el, ev, fn ) {
		if ( ev === "focusin" || ev === "focusout" ) {
			el.addEventListener( ev, fn );
		} else {
			const ev2 = `on${ ev }`;

			if ( el[ ev2 ] !== null ) {
				console.warn( `$on, ${ ev } is already set`, el[ ev2 ] );
			} else {
				el[ ev2 ] = fn;
			}
		}
	}
	static #getComputedStyle( el ) {
		return getComputedStyle( el );
	}
	static #setStyleSub( el, val, prop ) {
		if ( prop.startsWith( "--" ) ) {
			el.style.setProperty( prop, val );
		} else {
			el.style[ prop ] = val;
		}
	}
	static $setStyle( el, prop, val ) {
		if ( prop === undefined && val === undefined ) {
			return $$.#getComputedStyle( el );
		}
		if ( val !== undefined ) {
			return $$.#setStyleSub( el, val, prop );
		}
		if ( GSUisStr( prop ) ) {
			return prop.startsWith( "--" )
				? $$.#getComputedStyle( el ).getPropertyValue( prop )
				: $$.#getComputedStyle( el )[ prop ];
		}
		GSUforEach( prop, $$.#setStyleSub.bind( null, el ) );
	}
	static #scrollIntoViewX( el, par ) {
		if ( el && par ) {
			const elBCR = $.$bcr( el );
			const parBCR = $.$bcr( par );
			const elX = elBCR.x - parBCR.x;
			const diff = elX + elBCR.w - parBCR.w;

			if ( elX < 0 ) {
				par.scrollLeft += elX;
			} else if ( diff > 0 ) {
				par.scrollLeft += diff;
			}
		}
	}
	static #closestScrollable( el ) {
		const limit = $html.$get( 0 );
		let par = el;

		while ( par !== limit && ( par = par.parentNode ) ) {
			if ( $.$isScrollable( par ) ) {
				return par;
			}
		}
		return null;
	}
}

Object.freeze( $ );
Object.freeze( $$ );

/* eslint-disable */
const $noop = $();
const $head = $( document.head );
const $body = $( document.body );
const $html = $body.$parent();
const $popup = $.$elem( "gsui-popup" );
/* eslint-enable */

$body.$prepend( $popup );
