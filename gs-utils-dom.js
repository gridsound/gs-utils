"use strict";

const GSUpopup = document.createElement( "gsui-popup" );

document.body.prepend( GSUpopup );

// .............................................................................
function GSUdomDefine( tag, clazz ) {
	Object.freeze( clazz );
	customElements.define( tag, clazz );
}

// .............................................................................
function GSUdomQS(  el, sel ) { return GSUisStr( el ) ? document.querySelector( el ) : el.querySelector( sel ); }
function GSUdomQSA( el, sel ) { return GSUisStr( el ) ? document.querySelectorAll( el ) : el.querySelectorAll( sel ); }

// .............................................................................
function GSUdomTogClass( el, clazz, b ) { return el?.classList.toggle( clazz, b ) || false; }
function GSUdomAddClass( el, ...clazz ) { el?.classList.add( ...clazz ); }

// .............................................................................
function GSUdomUnselect() {
	window.getSelection().removeAllRanges();
}

// .............................................................................
const _GSUdomIsDblClick_delay = 300;
let _GSUdomIsDblClick_when = 0;
let _GSUdomIsDblClick_elem = null;

function GSUdomIsDblClick( e ) {
	if ( e.button === 0 ) {
		const now = Date.now();
		const old = _GSUdomIsDblClick_elem?.deref();

		if ( old !== e.target ) {
			_GSUdomIsDblClick_elem = new WeakRef( e.target );
			_GSUdomIsDblClick_when = now;
		} else {
			const dbl = now - _GSUdomIsDblClick_when < _GSUdomIsDblClick_delay;

			_GSUdomIsDblClick_when = dbl ? 0 : now;
			return dbl;
		}
	}
	return false;
}

// .............................................................................
const _GSUtemplates = new Map();

function GSUsetTemplate( tmpId, fn ) {
	_GSUtemplates.set( tmpId, fn );
}
function GSUhasTemplate( tmpId ) {
	return _GSUtemplates.has( tmpId );
}
function GSUgetTemplate( tmpId, ...args ) {
	return _GSUtemplates.get( tmpId )( ...args );
}

// .............................................................................
function GSUdomListen( el, cbs ) {
	el.addEventListener( "gsui", e => {
		const d = e.detail;
		const fn = cbs[ d.$event ];

		if ( fn && fn( d, ...d.$args ) !== true ) {
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	} );
}

// .............................................................................
function GSUdomRmAttr( el, ...attr ) { el && GSUforEach( attr, a => el.removeAttribute( a ) ); }
function GSUdomGetAttr( el, attr ) { return el ? el.getAttribute( attr ) : null; }
function GSUdomGetAttrNum( el, attr ) { return +GSUdomGetAttr( el, attr ) || 0; }
function GSUdomSetAttr_sub( el, attr, val ) {
	if ( val === false || val === null || val === undefined ) {
		GSUdomRmAttr( el, attr );
	} else if ( attr === "style" && !GSUisStr( val ) ) {
		GSUforEach( val, ( val, prop ) => el.style[ prop ] = val );
	} else {
		el.setAttribute( attr, val === true ? "" : val );
	}
}
function GSUdomSetAttr( el, attr, val ) {
	if ( el && attr ) {
		GSUisStr( attr )
			? GSUdomSetAttr_sub( el, attr, arguments.length === 2 || val )
			: GSUforEach( attr, ( val, a ) => GSUdomSetAttr_sub( el, a, val ) );
	}
}

// .............................................................................
const _GSUdomSVGelements = Object.freeze( "circle defs g line linearGradient path polygon polyline rect stop svg use"
	.split( " " ).reduce( ( map, s ) => ( map[ s ] = true, map ), {} ) );

function GSUcreateElement( tag, attr, ...children ) {
	const ns = tag in _GSUdomSVGelements
		? "http://www.w3.org/2000/svg"
		: "http://www.w3.org/1999/xhtml";
	const el = document.createElementNS( ns, tag );

	GSUdomSetAttr( el, attr );
	el.append( ...children.flat( 1 ).filter( ch => Boolean( ch ) || Number.isFinite( ch ) ) );
	return el;
}
function GSUcreateIcon( attr ) {
	const attr2 = {
		inert: true,
		...attr,
		class: `gsuiIcon${ attr?.class ? ` ${ attr.class }` : "" }`,
		"data-icon": attr?.icon || null,
		"data-spin": attr?.spin ? "on" : null,
	};

	delete attr2.icon;
	return GSUcreateElement( "i", attr2 );
}
function GSUcreateButton( attr, ...child ) {
	const attr2 = {
		type: "button",
		...attr,
		class: `${ attr?.class || "" }${ attr?.icon ? " gsuiIcon" : "" }` || null,
		"data-icon": attr?.icon || null,
	};

	delete attr2.icon;
	return GSUcreateElement( "button", attr2, ...child );
}
function GSUcreateA( attr, ...child ) { return GSUcreateElement( "a", { href: true, ...attr }, ...child ); }
function GSUcreateDiv( attr, ...child ) { return GSUcreateElement( "div", attr, ...child ); }
function GSUcreateFlex( attr, ...child ) { return GSUcreateElement( "gs-flex", attr, ...child ); }
function GSUcreateAExt( attr, ...child ) { return GSUcreateA( { ...attr, target: "_blank", rel: "noopener" }, ...child ); }
function GSUcreateSpan( attr, ...child ) { return GSUcreateElement( "span", attr, ...child ); }
function GSUcreateInput( attr, ...child ) { return GSUcreateElement( "input", attr, ...child ); }
function GSUcreateLabel( attr, ...child ) { return GSUcreateElement( "label", attr, ...child ); }
function GSUcreateSelect( attr, ...child ) { return GSUcreateElement( "select", attr, ...child ); }
function GSUcreateOption( attr, child ) { return GSUcreateElement( "option", attr, child || attr?.value ); }

// .............................................................................
function GSUdomViewBox( svg, x, y, w, h ) {
	GSUdomSetAttr( svg, "viewBox", arguments.length === 5
		? `${ x } ${ y } ${ w } ${ h }`
		: `0 0 ${ x } ${ y }` );
}

// .............................................................................
const _GSUdomResizeMap = new Map();
const _GSUdomResizeObs = new ResizeObserver( entries => {
	entries.forEach( e => {
		_GSUdomResizeMap.get( e.target )
			.forEach( fn => fn( e.contentRect.width, e.contentRect.height ) );
	} );
} );

function GSUdomObserveSize( el, fn ) {
	if ( _GSUdomResizeMap.has( el ) ) {
		_GSUdomResizeMap.get( el ).push( fn );
	} else {
		_GSUdomResizeMap.set( el, [ fn ] );
	}
	_GSUdomResizeObs.observe( el );
}
function GSUdomUnobserveSize( el, fn ) {
	const fns = _GSUdomResizeMap.get( el );
	const fnInd = fns?.indexOf( fn );

	if ( fnInd > -1 ) {
		_GSUdomResizeObs.unobserve( el );
		fns.splice( fnInd, 1 );
		if ( fns.length === 0 ) {
			_GSUdomResizeMap.delete( el );
		}
	}
}

// .............................................................................
function GSUdomScrollIntoViewX( el, par ) {
	if ( el && par ) {
		const elBCR = $( el ).$bcr();
		const parBCR = $( par ).$bcr();
		const elX = elBCR.x - parBCR.x;
		const diff = elX + elBCR.w - parBCR.w;

		if ( elX < 0 ) {
			par.scrollLeft += elX;
		} else if ( diff > 0 ) {
			par.scrollLeft += diff;
		}
	}
}

// .............................................................................
function GSUdomIsScrollable( el ) {
	___( el, "element" );
	const ov = $.$css( el, "overflow" );

	return ov === "auto" || ov === "scroll";
}
function GSUdomClosestScrollable( el ) {
	___( el, "element" );
	const limit = $html.$get( 0 );
	let par = el;

	while ( par !== limit && ( par = par.parentNode ) ) {
		if ( GSUdomIsScrollable( par ) ) {
			return par;
		}
	}
	return null;
}

// .............................................................................
function GSUdomSetChildrenLength( el, n, tag, prop ) {
	if ( el.children.length < n ) {
		el.append( ...GSUnewArray( n - el.children.length, () => GSUcreateElement( tag, prop ) ) );
	} else {
		while ( el.children.length > n ) {
			el.lastChild.remove();
		}
	}
}
