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
function GSUdomSetChildrenLength( el, n, tag, prop ) {
	if ( el.children.length < n ) {
		el.append( ...GSUnewArray( n - el.children.length, () => $.$elem( tag, prop ) ) );
	} else {
		while ( el.children.length > n ) {
			el.lastChild.remove();
		}
	}
}
