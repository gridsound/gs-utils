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
function GSUdomQS(  el, sel ) { return GSUisStr( el ) ? document.querySelector( el ) : el.querySelector( sel ); }
function GSUdomQSA( el, sel ) { return GSUisStr( el ) ? document.querySelectorAll( el ) : el.querySelectorAll( sel ); }

// .............................................................................
function GSUdomHasClass( el, clazz    ) { return el?.classList.contains( clazz    ) || false; }
function GSUdomTogClass( el, clazz, b ) { return el?.classList.toggle(   clazz, b ) || false; }
function GSUdomRepClass( el, clazz, b ) { return el?.classList.replace(  clazz, b ) || false; }
function GSUdomAddClass( el, ...clazz ) { el?.classList.add(    ...clazz ); }
function GSUdomRmClass ( el, ...clazz ) { el?.classList.remove( ...clazz ); }

// .............................................................................
function GSUdomGetSize( el ) { return el ? [ el.clientWidth, el.clientHeight ] : [ 0, 0 ]; }
function GSUdomBCRxy( el )   { const r = GSUdomBCR( el ); return r ? [ r.x, r.y ] : [ 0, 0 ]; }
function GSUdomBCRwh( el )   { const r = GSUdomBCR( el ); return r ? [ r.w, r.h ] : [ 0, 0 ]; }
function GSUdomBCRxywh( el ) { const r = GSUdomBCR( el ); return r ? [ r.x, r.y, r.w, r.h ] : [ 0, 0, 0, 0 ]; }
function GSUdomBCR( el ) {
	const bcr = el?.getBoundingClientRect() || null;

	if ( bcr ) {
		bcr.w = bcr.width;
		bcr.h = bcr.height;
	}
	return bcr;
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
function GSUdomDispatch( el, ev, ...args ) {
	el.dispatchEvent( new CustomEvent( "gsui", {
		bubbles: true,
		detail: { $event: ev, $args: args, $target: el },
	} ) );
}
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
function GSUcreateElement( tag, attr, ...children ) {
	return _GSUcreateElement( "http://www.w3.org/1999/xhtml", tag, attr, children );
}
function GSUcreateElementSVG( tag, attr, ...children ) {
	return _GSUcreateElement( "http://www.w3.org/2000/svg", tag, attr, children );
}
function _GSUcreateElement( ns, tag, attrObj, children ) {
	const el = document.createElementNS( ns, tag );

	GSUdomSetAttr( el, attrObj );
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
function GSUcreateFlex( attr, ...child ) { return GSUcreateElement( "gs-flex", attr, ...child ); }
function GSUcreateAExt( attr, ...child ) { return GSUcreateA( { ...attr, target: "_blank", rel: "noopener" }, ...child ); }
function GSUcreateSpan( attr, ...child ) { return GSUcreateElement( "span", attr, ...child ); }
function GSUcreateInput( attr, ...child ) { return GSUcreateElement( "input", attr, ...child ); }
function GSUcreateLabel( attr, ...child ) { return GSUcreateElement( "label", attr, ...child ); }
function GSUcreateSelect( attr, ...child ) { return GSUcreateElement( "select", attr, ...child ); }
function GSUcreateOption( attr, child ) { return GSUcreateElement( "option", attr, child || attr?.value ); }

// .............................................................................
function GSUdomRmAttr( el, ...attr ) { el && GSUforEach( attr, a => el.removeAttribute( a ) ); }
function GSUdomHasAttr( el, attr ) { return el ? el.hasAttribute( attr ) : false; }
function GSUdomGetAttr( el, attr ) { return el ? el.getAttribute( attr ) : null; }
function GSUdomGetAttrNum( el, attr ) { return +GSUdomGetAttr( el, attr ) || 0; }
function GSUdomSetAttr( el, attr, val ) {
	if ( el && attr ) {
		GSUisStr( attr )
			? _GSUdomSetAttr( el, attr, arguments.length === 2 || val )
			: GSUforEach( attr, ( val, a ) => _GSUdomSetAttr( el, a, val ) );
	}
}
function GSUdomTogAttr( el, attr, val = true ) {
	if ( el && attr ) {
		_GSUdomSetAttr( el, attr, val === true
			? !GSUdomHasAttr( el, attr )
			: GSUdomGetAttr( el, attr ) === val ? false : val );
	}
}
function _GSUdomSetAttr( el, attr, val ) {
	if ( val === false || val === null || val === undefined ) {
		GSUdomRmAttr( el, attr );
	} else if ( attr === "style" && !GSUisStr( val ) ) {
		GSUforEach( val, ( val, prop ) => el.style[ prop ] = val );
	} else {
		el.setAttribute( attr, val === true ? "" : val );
	}
}
function GSUsetViewBox( svg, x, y, w, h ) { GSUdomSetAttr( svg, "viewBox", `${ x } ${ y } ${ w } ${ h }` ); }
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
	GSUforEach( props, ( val, p ) => {
		GSUdomHasAttr( el, p )
			? el.attributeChangedCallback?.( p, null, GSUdomGetAttr( el, p ) )
			: val !== false
				? _GSUdomSetAttr( el, p, val )
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
