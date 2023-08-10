"use strict";

const GSUpopup = document.createElement( "gsui-popup" );
const GSUdragshield = document.createElement( "gsui-dragshield" );

document.body.prepend( GSUdragshield, GSUpopup );

// -----------------------------------------------------------------------------
function GSUunselectText() {
	window.getSelection().removeAllRanges();
}

// -----------------------------------------------------------------------------
function GSUemptyElement( el ) {
	while ( el.lastChild ) {
		el.lastChild.remove();
	}
}

// -----------------------------------------------------------------------------
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

// -----------------------------------------------------------------------------
function GSUfindElements( root, graph ) {
	return typeof graph === "string"
		? _GSUfindElementsStr( root, graph )
		: Object.seal( Array.isArray( graph )
			? _GSUfindElementsArr( root, graph )
			: _GSUfindElementsObj( root, graph ) );
}
function _GSUfindElementsArr( root, arr ) {
	return arr.map( sel => GSUfindElements( root, sel ) );
}
function _GSUfindElementsObj( root, obj ) {
	if ( obj ) {
		const ent = Object.entries( obj );

		ent.forEach( kv => kv[ 1 ] = GSUfindElements( root, kv[ 1 ] ) );
		return Object.fromEntries( ent );
	}
}
function _GSUfindElementsStr( root, sel ) {
	if ( Array.isArray( root ) ) {
		let el;

		Array.prototype.find.call( root, r => el = _GSUfindElementsQuery( r, sel ) );
		return el || null;
	}
	return _GSUfindElementsQuery( root, sel );
}
function _GSUfindElementsQuery( root, sel ) {
	return root.matches( sel )
		? root
		: root.querySelector( sel );
}

// -----------------------------------------------------------------------------
function GSUdispatchEvent( el, component, eventName, ...args ) {
	el.dispatchEvent( new CustomEvent( "gsuiEvents", {
		bubbles: true,
		detail: { component, eventName, args },
	} ) );
}
function GSUlistenEvents( el, cbs ) {
	el.addEventListener( "gsuiEvents", e => {
		const d = e.detail;
		const cbs2 = cbs[ d.component ] || cbs.default;
		const fn = cbs2 && ( cbs2[ d.eventName ] || cbs2.default );

		if ( fn && fn( d, e.target, e ) !== true ) {
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	} );
}

// -----------------------------------------------------------------------------
function GSUcreateElement( tag, attr, ...children ) {
	return _GSUcreateElement( "http://www.w3.org/1999/xhtml", tag, attr, children );
}
function GSUcreateElementSVG( tag, attr, ...children ) {
	return _GSUcreateElement( "http://www.w3.org/2000/svg", tag, attr, children );
}
function _GSUcreateElement( ns, tag, attrObj, children ) {
	const el = document.createElementNS( ns, tag );

	GSUsetAttribute( el, attrObj );
	el.append( ...children.flat( 1 ).filter( ch => Boolean( ch ) || Number.isFinite( ch ) ) );
	return el;
}

// -----------------------------------------------------------------------------
function GSUhasAttribute( el, attr ) {
	return el.hasAttribute( attr );
}
function GSUgetAttribute( el, attr ) {
	return el.getAttribute( attr );
}
function GSUgetAttributeNum( el, attr ) {
	const val = el.getAttribute( attr );
	const n = +val;

	if ( Number.isNaN( n ) ) {
		console.error( `GSUgetAttributeNum: ${ attr } is NaN (${ val })` );
	}
	return n;
}
function GSUsetAttribute( el, attr, val ) {
	if ( typeof attr === "string" ) {
		_GSUsetAttribute( el, attr, val );
	} else if ( attr ) {
		Object.entries( attr ).forEach( kv => _GSUsetAttribute( el, ...kv ) );
	}
}
function _GSUsetAttribute( el, attr, val ) {
	val !== false && val !== null && val !== undefined
		? el.setAttribute( attr, val === true ? "" : val )
		: el.removeAttribute( attr );
}

// -----------------------------------------------------------------------------
function GSUrecallAttributes( el, props ) {
	Object.entries( props ).forEach( ( [ p, val ] ) => {
		el.hasAttribute( p )
			? el.attributeChangedCallback?.( p, null, el.getAttribute( p ) )
			: _GSUsetAttribute( el, p, val );
	} );
}

// -----------------------------------------------------------------------------
const _GSUresizeMap = new Map();
const _GSUresizeObs = new ResizeObserver( entries => {
	entries.forEach( e => {
		_GSUresizeMap.get( e.target )
			.forEach( fn => fn( e.contentRect.width, e.contentRect.height ) );
	} );
} );

function GSUobserveSizeOf( el, fn ) {
	if ( _GSUresizeMap.has( el ) ) {
		_GSUresizeMap.get( el ).push( fn );
	} else {
		_GSUresizeMap.set( el, [ fn ] );
	}
	_GSUresizeObs.observe( el );
}
function GSUunobserveSizeOf( el, fn ) {
	const fns = _GSUresizeMap.get( el );
	const fnInd = fns?.indexOf( fn );

	if ( fnInd > -1 ) {
		_GSUresizeObs.unobserve( el );
		fns.splice( fnInd, 1 );
		if ( fns.length === 0 ) {
			_GSUresizeMap.delete( el );
		}
	}
}
