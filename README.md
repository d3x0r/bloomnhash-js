

# Blooming Hash (JS Package)

JS implementation of a fragmented hash map.

This is a key-value relation track; it's more like `Map()` than a hash; it relies on external users to generate their own values to be hashed.

This is best when fed entries that have a lot of change in the first bytes of the string to store; sequential inserts cause the most work.

See Also https://github.com/d3x0r/BloomNHash for C version and other tests.

This has hooks to support [object storage](https://github.com/d3x0r/sack.vfs/blob/master/README_ObjectStorage.md); 
includes hold off timer to flush writes; allowing rapid updates to perform quickly, while writing blocks of changes at once; 
reduces re-writing the same hash blocks that have similar changes quickly.

This implementation is async(promise based).

|method| args | return | description |
|---|----|----|----|
|(constructor) | (<optional storage>) | hash | An optional object storage instance can be passed to the constructor. |
|get| (string) | object | Returns a promise which resolves with the object stored in the hash at the specified string. |
|set| (string,object) | -none- | Returns a promise which resolves when the specified object is setat the specified string.  It's just a completion event. |
|caseInsensitive| set/get | bool | sets comparisons to case insensitive ('en', 'base') |
|delete| (string) | remove a reference from the tree |
|store| () | Promise( id ) | Store returns a promise that resolves to the object storage ID of the stored hash block.  This unique identifier will need to be used to recover this hash tree.  |


## In memory example.

This code fragment demonstrates the above method descriptions; except for `store()`.

``` js
import {BloomNHash} from "./bloomNHash.mjs"

{
	const hash = new BloomNHash();
        hash.set( "asdf", 1 );
        hash.get( "asdf" ).then( (object)=>{
		console.log( "This probably got deleted before actually getting done, maybe?" );
	} );
	// value = 1.
        hash.delete( "asdf" );
}

```

## Example of usage with object storage.


This demonstrates hooking into storage; the fragments of the hash will automatically be tracked as stored objects.
`get` and `set` methods load externally stored entries sparsely.

A more complete example would demonstrate storing the object that is set in the hash map.  Objects that have
themselves been saved (or loaded) in object storage will have remote references stored in the hash blocks, and 
will refer to the external object instead.

`store()` operations are grouped so the file representing the hash and hash blocks themselves don't have to be written as often.  A hold-off delay is used,
that each store pushes the timer forward a little, so a certain period of inactivity has to happen before flushing to physical or network storage.

``` js
import {sack} from "sack.vfs"
import {BloomNHash} from "node_modules/@d3x0r/bloomnhash/bloomNHash.js"

async function init() 
{
	const storage = sack.ObjectStorage( "Filename" );
	BloomNHash.hook( storage );

	let hash = null;

	let root = await storage.getRoot();
	if( !root.find( "config" ) ){
		hash = new BloomNHash(storage);
		let root   = await storage.getRoot();
		const file = await root.create( "config" );
		const id   = await hash.store(); // storing the hash 
		file.write( id );
	}else {
		const file = await root.open("config");
		hash       = await storage.get( {id: file.read() } );
	}

	const already = await hash.get( "asdf" );
	if( !already )
	        hash.set( "asdf", 1 );
	else
		console.log( "Value is already:", already );

}

```


## Changelog
- 1.0.3(in progress)
  - renamed bitreader; fixed missing general export
  - fix tracking hash root better
  - Fix case insensitive lookup.
- 1.0.2
  - add `caseInsensitive` setting.
- 1.0.1
  - Bitreader object storage was missing (added).
  - Track relation between blocks and their root better
  - Improve notification of multiple readers getting loading the same bloom.
  - Refactor to classes.
  - Handle registration and revival better.
- 1.0.0 - Initial Release
