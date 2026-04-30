"use strict";

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
function GSUdomSetChildrenLength( el, n, tag, prop ) {
	if ( el.children.length < n ) {
		el.append( ...GSUnewArray( n - el.children.length, () => $.$elem( tag, prop ) ) );
	} else {
		while ( el.children.length > n ) {
			el.lastChild.remove();
		}
	}
}
