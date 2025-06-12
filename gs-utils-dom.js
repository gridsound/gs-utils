"use strict";

const GSUpopup = document.createElement( "gsui-popup" );

document.body.prepend( GSUpopup );

// .............................................................................
function GSUdefineElement( name, clazz ) {
	Object.freeze( clazz );
	customElements.define( name, clazz );
}

// .............................................................................
function GSUdomIsCustomElement( el ) {
	return el?.tagName.includes( "-" );
}

// .............................................................................
function GSUdomBCR( el ) {
	const bcr = el?.getBoundingClientRect() || null;

	if ( bcr ) {
		bcr.w = bcr.width;
		bcr.h = bcr.height;
	}
	return bcr;
}
function GSUdomBCRxy( el ) {
	const bcr = GSUdomBCR( el );

	return [ bcr?.x || 0, bcr?.y || 0 ];
}
function GSUdomBCRwh( el ) {
	return [ el?.clientWidth || 0, el?.clientHeight || 0 ];
}
function GSUdomBCRxywh( el ) {
	return [ ...GSUdomBCRxy( el ), ...GSUdomBCRwh( el ) ];
}

// .............................................................................
function GSUunselectText() {
	window.getSelection().removeAllRanges();
}

// .............................................................................
function GSUemptyElement( el ) {
	while ( el.lastChild ) {
		el.lastChild.remove();
	}
}

// .............................................................................
function GSUsetChildrenNumber( el, n, tag, prop ) {
	return _GSUsetChildrenNumber( el, n, tag, prop, GSUcreateElement );
}
function GSUsetSVGChildrenNumber( el, n, tag, prop ) {
	return _GSUsetChildrenNumber( el, n, tag, prop, GSUcreateElementSVG );
}
function _GSUsetChildrenNumber( el, n, tag, prop, createFn ) {
	if ( el.children.length < n ) {
		el.append( ...GSUnewArray( n - el.children.length, () => createFn( tag, prop ) ) );
	} else {
		while ( el.children.length > n ) {
			el.lastChild.remove();
		}
	}
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
function GSUfindElements( root, graph ) {
	return GSUisStr( graph )
		? _GSUfindElementsStr( root, graph )
		: Object.seal( GSUisArr( graph )
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
	if ( sel.startsWith( "[]" ) ) {
		const sel2 = sel.slice( 2 );

		return !GSUisArr( root )
			? _GSUfindElementsQueryAll( root, sel2 )
			: root.map( r => _GSUfindElementsQueryAll( r, sel2 ) ).flat();
	}
	if ( GSUisArr( root ) ) {
		let el;

		root.find( r => el = _GSUfindElementsQuery( r, sel ) );
		return el || null;
	}
	return _GSUfindElementsQuery( root, sel );
}
function _GSUfindElementsQuery( root, sel ) {
	return root.matches( sel )
		? root
		: root.querySelector( sel );
}
function _GSUfindElementsQueryAll( root, sel ) {
	const arr = Array.from( root.querySelectorAll( sel ) );

	if ( root.matches( sel ) ) {
		arr.unshift( root );
	}
	return arr;
}

// .............................................................................
function GSUdispatchEvent( el, component, eventName, ...args ) {
	el.dispatchEvent( new CustomEvent( "gsuiEvents", {
		bubbles: true,
		detail: { component, eventName, args, target: el },
	} ) );
}
function GSUlistenEvents( el, cbs ) {
	el.addEventListener( "gsuiEvents", e => {
		const d = e.detail;
		const cbs2 = cbs[ d.component ] || cbs.default;
		const fn = cbs2 && ( cbs2[ d.eventName ] || cbs2.default );

		if ( fn && fn( d, d.target, e ) !== true ) {
			e.stopPropagation();
			e.stopImmediatePropagation();
		}
	} );
}

// .............................................................................
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
function GSUcreateIcon( attr ) {
	const attr2 = { 
		...attr,
		class: `gsuiIcon${ attr?.class ? ` ${ attr.class }` : "" }`,
		"data-icon": attr?.icon || null,
		"data-spin": attr?.spin ? "on" : null,
		inert: true,
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
function GSUcreateAExt( attr, ...child ) { return GSUcreateA( { ...attr, target: "_blank", rel: "noopener" }, ...child ); }
function GSUcreateSpan( attr, ...child ) { return GSUcreateElement( "span", attr, ...child ); }
function GSUcreateInput( attr, ...child ) { return GSUcreateElement( "input", attr, ...child ); }
function GSUcreateLabel( attr, ...child ) { return GSUcreateElement( "label", attr, ...child ); }
function GSUcreateSelect( attr, ...child ) { return GSUcreateElement( "select", attr, ...child ); }
function GSUcreateOption( attr, child ) { return GSUcreateElement( "option", attr, child || attr?.value ); }

// .............................................................................
function GSUhasAttribute( el, attr ) {
	return el.hasAttribute( attr );
}
function GSUgetAttribute( el, attr ) {
	return el.getAttribute( attr );
}
function GSUgetAttributeNum( el, attr ) {
	const val = el.getAttribute( attr );
	const n = +val;

	if ( GSUisNaN( n ) ) {
		console.error( `GSUgetAttributeNum: ${ attr } is NaN (${ val })` );
	}
	return n;
}
function GSUsetAttribute( el, attr, val ) {
	if ( GSUisStr( attr ) ) {
		_GSUsetAttribute( el, attr, val );
	} else if ( attr ) {
		Object.entries( attr ).forEach( kv => _GSUsetAttribute( el, ...kv ) );
	}
}
function GSUtoggleAttribute( el, attr, val = true ) {
	_GSUsetAttribute( el, attr, val === true
		? !GSUhasAttribute( el, attr )
		: GSUgetAttribute( el, attr ) === val ? false : val );
}
function _GSUsetAttribute( el, attr, val ) {
	if ( val === false || val === null || val === undefined ) {
		el.removeAttribute( attr );
	} else if ( attr === "style" && !GSUisStr( val ) ) {
		GSUforEach( val, ( val, prop ) => el.style[ prop ] = val );
	} else {
		el.setAttribute( attr, val === true ? "" : val );
	}
}
function GSUsetViewBox( svg, x, y, w, h ) { GSUsetAttribute( svg, "viewBox", `${ x } ${ y } ${ w } ${ h }` ); }
function GSUsetViewBoxWH( svg, w, h ) { GSUsetViewBox( svg, 0, 0, w, h ); }

// .............................................................................
function GSUgetStyle( el, prop ) {
	return !prop
		? getComputedStyle( el )
		: prop.startsWith( "--" )
			? el.style.getPropertyValue( prop )
			: getComputedStyle( el )[ prop ];
}
function GSUsetStyle( el, prop, val ) {
	GSUisStr( prop )
		? _GSUsetStyle( el, val, prop )
		: GSUforEach( prop, _GSUsetStyle.bind( null, el ) );
}
function _GSUsetStyle( el, val, prop ) {
	if ( prop.startsWith( "--" ) ) {
		el.style.setProperty( prop, val );
	} else {
		el.style[ prop ] = val;
	}
}

// .............................................................................
function GSUrecallAttributes( el, props ) {
	Object.entries( props ).forEach( ( [ p, val ] ) => {
		el.hasAttribute( p )
			? el.attributeChangedCallback?.( p, null, el.getAttribute( p ) )
			: val !== false
				? _GSUsetAttribute( el, p, val )
				: el.$attributeChanged?.( p, null, null )
	} );
}

// .............................................................................
function GSUhasDataTransfer( e, list ) {
	return list.some( k => e.dataTransfer.types.includes( k ) );
}
function GSUgetDataTransfer( e, list ) {
	const ret = [];

	list.find( k => {
		const dat = e.dataTransfer.getData( k );

		if ( dat ) {
			ret.push( k, dat );
			return true;
		}
	} );
	return ret;
}

// .............................................................................
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

// .............................................................................
function GSUscrollIntoViewX( el, par ) {
	if ( el && par ) {
		const elBCR = GSUdomBCR( el );
		const parBCR = GSUdomBCR( par );
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
	const ov = GSUgetStyle( el, "overflow" );

	return ov === "auto" || ov === "scroll";
}
function GSUdomClosestScrollable( el ) {
	___( el, "element" );
	let par = el;

	while ( par !== document.documentElement && ( par = par.parentNode ) ) {
		if ( GSUdomIsScrollable( par ) ) {
			return par;
		}
	}
	return null;
}
