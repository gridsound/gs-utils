"use strict";

function GSUdomSetChildrenLength( el, n, tag, prop ) {
	if ( el.children.length < n ) {
		el.append( ...GSUnewArray( n - el.children.length, () => $.$elem( tag, prop ) ) );
	} else {
		while ( el.children.length > n ) {
			el.lastChild.remove();
		}
	}
}
