import { PriorityQueue } from './src/PriorityQueue'
import { suite, test } from 'mocha-typescript'
import { equal, deepEqual } from 'assert'

@suite class PriorityQueueTestSute {
	@test("length") caseLength() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		nq.enqueue( "", 0 )
		equal( nq.length, 1 )
		nq.enqueue( "", 0 )
		equal( nq.length, 2 )
		nq.enqueue( "", 0 )
		equal( nq.length, 3 )
		nq.dequeue()
		equal( nq.length, 2 )
		nq.enqueue( "", 0 )
		equal( nq.length, 3 )
		nq.dequeue()
		equal( nq.length, 2 )
		nq.dequeue()
		equal( nq.length, 1 )
		nq.dequeue()
		equal( nq.length, 0 )
	}

	@test("enqueue returns descriptor") caseEnqueue() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.enqueue( "", 0 ), 0 )
		equal( nq.enqueue( "", 0 ), 1 )
		equal( nq.enqueue( "", 0 ), 2 )
		equal( nq.enqueue( "", 3 ), 3 )
		equal( nq.enqueue( "", 2 ), 4 )
	}

	@test("it's ok to queue same items, even with same priorities") caseEnqueueSame() {
		const nq = new PriorityQueue<string,number>()
		nq.enqueue( "", 0 )
		equal( nq.length, 1 )
		nq.enqueue( "", 0 )
		equal( nq.length, 2 )
		nq.enqueue( "", 1 )
		equal( nq.length, 3 )
		nq.enqueue( "a", 1 )
		equal( nq.length, 4 )
		nq.enqueue( "b", 2 )
		equal( nq.length, 5 )
	}

	@test("dequeue returns element with higher priority (min by default)") dequeueCase() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		equal( nq.enqueue( "1", 1 ), 0 )
		equal( nq.enqueue( "2", 2 ), 1 )
		equal( nq.enqueue( "0", 0 ), 2 )
		equal( nq.enqueue( "5", 5 ), 3 )
		equal( nq.enqueue( "3", 3 ), 4 )
		equal( nq.enqueue( "4", 4 ), 5 )
		equal( nq.length, 6 )
		equal( nq.dequeue(), "0" )
		equal( nq.dequeue(), "1" )
		equal( nq.dequeue(), "2" )
		equal( nq.length, 3 )
		equal( nq.dequeue(), "3" )
		equal( nq.dequeue(), "4" )
		equal( nq.dequeue(), "5" )
		equal( nq.length, 0 )
	}

	@test("dequeue from empty returns undefined") dequeueEmpty() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		equal( nq.dequeue(), undefined )
		nq.enqueue( "", 0 )
		equal( nq.length, 1 )
		nq.dequeue()
		equal( nq.dequeue(), undefined )
	}
	
	@test("default comparator: min heap") defaultComparator() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		nq.enqueue( "second", 2 )
		nq.enqueue( "first", 1 )
		nq.enqueue( "third", 3 )
		equal( nq.length, 3 )
		equal( nq.dequeue(), "first" )
		equal( nq.dequeue(), "second" )
		equal( nq.dequeue(), "third" )
		equal( nq.length, 0 )
	}

	@test("custom comparator: max heap") case6() {
		const comparator = (a: number, b: number): number => a > b ? -1 : a < b ? 1 : 0
		const nq = new PriorityQueue<string,number>( comparator )
		equal( nq.length, 0 )
		nq.enqueue( "second", 2 )
		nq.enqueue( "first", 1 )
		nq.enqueue( "third", 3 )
		equal( nq.length, 3 )
		equal( nq.dequeue(), "third" )
		equal( nq.dequeue(), "second" )
		equal( nq.dequeue(), "first" )
		equal( nq.length, 0 )
	}

	@test("has and not has") hasOrNot() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		const secondDescriptor = nq.enqueue( "second", 2 )
		const firstDescriptor = nq.enqueue( "first", 1 )
		nq.enqueue( "third", 3 )
		equal( nq.has( "first" ), true )
		equal( nq.has( "first", firstDescriptor ), true )
		equal( nq.has( "second" ), true )
		equal( nq.has( "third" ), true )
		equal( nq.has( "fourth" ), false )
		nq.dequeue()
		equal( nq.has( "first" ), false )
		equal( nq.has( "second", secondDescriptor ), true )
		equal( nq.has( "third" ), true )
		nq.dequeue()
		equal( nq.has( "third" ), true )
		equal( nq.has( "second" ), false )
		nq.dequeue()
		equal( nq.has( "third" ), false )
		equal( nq.length, 0 )
	}
	
	@test("has with wrong descriptor returns false") hasWrongDescriptor() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		const secondDescriptor = nq.enqueue( "second", 2 )
		const firstDescriptor = nq.enqueue( "first", 1 )
		equal( nq.has( "first" ), true )
		equal( nq.has( "first", firstDescriptor ), true )
		equal( nq.has( "first", secondDescriptor ), false )
		equal( nq.has( "third", 2 ), false )
		equal( nq.has( "third" ), false )
		nq.dequeue()
		equal( nq.has( "first" ), false )
		equal( nq.has( "first", firstDescriptor ), false )
		equal( nq.has( "first", secondDescriptor ), false )
	}

	@test("update") updateCase() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		const secondDescriptor = nq.enqueue( "second", 2 )
		const firstDescriptor = nq.enqueue( "first", 1 )
		const thirdDescriptor = nq.enqueue( "third", 3 )
		nq.update( "first", 5 )
		nq.update( "second", 4, secondDescriptor )
		equal( nq.dequeue(), "third" )
		equal( nq.dequeue(), "second" )
		equal( nq.dequeue(), "first" )
	}

	@test("update wrong descriptor doesn't change priority") updateWrong() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		const secondDescriptor = nq.enqueue( "second", 2 )
		const firstDescriptor = nq.enqueue( "first", 1 )
		const thirdDescriptor = nq.enqueue( "third", 3 )
		nq.update( "first", 5, secondDescriptor )
		nq.update( "fourth", 1, firstDescriptor )
		equal( nq.dequeue(), "first" )
		equal( nq.dequeue(), "second" )
		equal( nq.dequeue(), "third" )
		equal( nq.length, 0 )
	}

	@test("update not existing item returns -1") updateEnqueue() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		const secondDescriptor = nq.enqueue( "second", 2 )
		const firstDescriptor = nq.enqueue( "first", 1 )
		const thirdDescriptor = nq.update( "third", 3 )
		equal( nq.descriptorOf( "third" ), -1 )
		equal( nq.dequeue(), "first" )
		equal( nq.dequeue(), "second" )
		equal( nq.dequeue(), undefined )
	}

	@test("delete returns true if items queued and false otherwise") deleteCase() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		const secondDescriptor = nq.enqueue( "second", 2 )
		const firstDescriptor = nq.enqueue( "first", 1 )
		const thirdDescriptor = nq.enqueue( "third", 3 )
		equal( nq.delete( "second" ), true )
		equal( nq.delete( "second" ), false )
		equal( nq.dequeue(), "first" )
		equal( nq.delete( "first" ), false )
		equal( nq.delete( "third" ), true )
		equal( nq.length, 0 )
	}

	@test("descriptorOf returns descriptor of enqueued item; if item isn't queued returns -1") findDescriptor() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		const secondDescriptor = nq.enqueue( "second", 2 )
		const firstDescriptor = nq.enqueue( "first", 1 )
		const thirdDescriptor = nq.enqueue( "third", 3 )
		equal( nq.descriptorOf( "second" ), secondDescriptor )
		equal( nq.descriptorOf( "first" ), firstDescriptor )
		equal( nq.descriptorOf( "third" ), thirdDescriptor )
		equal( nq.descriptorOf( "fourth" ), -1 )
		equal( nq.length, 3 )
	}

	@test("first returns first item or undefined if queue is empty") firstElement() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		equal( nq.first(), undefined )
		const secondDescriptor = nq.enqueue( "second", 2 )
		const firstDescriptor = nq.enqueue( "first", 1 )
		const thirdDescriptor = nq.enqueue( "third", 3 )
		equal( nq.first(), "first" )
	}

	@test("firstPriority returns first priority or undefined if queue is empty") firstPriority() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		equal( nq.firstPriority(), undefined )
		const secondDescriptor = nq.enqueue( "second", 2 )
		const firstDescriptor = nq.enqueue( "first", 1 )
		const thirdDescriptor = nq.enqueue( "third", 3 )
		equal( nq.firstPriority(), 1 )
	}

	@test("forEach iterates through elements (not sorted)") forEachCase() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		nq.enqueue( "second", 2 )
		nq.enqueue( "first", 1 )
		nq.enqueue( "third", 3 )
		const items: [string,number][] = []
		nq.forEach( (element,priority,q) => {
			items.push( [element,priority] )
		})
		items.sort( ([_,priority1],[_e,priority2]): number => priority1 - priority2 )
		equal( nq.dequeue(), items[0][0] )
		equal( nq.dequeue(), items[1][0] )
		equal( nq.dequeue(), items[2][0] )
	}

	@test("constructor's second argument enqueues items") constructorDefault() {
		const nq = new PriorityQueue<string,number>( undefined, [["first",1],["third",3],["second",2]])
		equal( nq.dequeue(), "first" )
		equal( nq.dequeue(), "second" )
		equal( nq.dequeue(), "third" )
		equal( nq.length, 0 )
	}
	
	@test("constructor's third argument is used to store descriptors") constructorBuffer() {
		const descriptors = []
		const nq = new PriorityQueue<string,number>( undefined, [["first",1],["third",3],["second",2]], descriptors )
		equal( nq.descriptorOf( "first" ), descriptors[0] )
		equal( nq.descriptorOf( "second" ), descriptors[2] )
		equal( nq.descriptorOf( "third" ), descriptors[1] )
		equal( nq.length, 3 )
	}
	
	@test("constructor's fourth argument is offset for buffer used to store descriptors") constructorBufferOffset() {
		const descriptors = [-1,-1,-1]
		const nq = new PriorityQueue<string,number>( undefined, [["first",1],["third",3],["second",2]], descriptors, 2 )
		equal( nq.descriptorOf( "first" ), descriptors[2] )
		equal( nq.descriptorOf( "second" ), descriptors[4] )
		equal( nq.descriptorOf( "third" ), descriptors[3] )
		equal( nq.length, 3 )
	}
	
	@test("batchEnqueue") batchEnqueue() {
		const nq = new PriorityQueue<string,number>()
		nq.batchEnqueue([["first",1],["third",3],["second",2]]) 
		equal( nq.dequeue(), "first" )
		equal( nq.dequeue(), "second" )
		equal( nq.dequeue(), "third" )
		nq.batchEnqueue([["first",1],["third",3],["second",2]]) 
		equal( nq.dequeue(), "first" )
		equal( nq.dequeue(), "second" )
		equal( nq.dequeue(), "third" )
		equal( nq.length, 0 )
	}
	
	@test("batchEnqueue with buffer") batchEnqueueBuffer() {
		const descriptors = []
		const nq = new PriorityQueue<string,number>()
		nq.batchEnqueue( [["first",1],["third",3],["second",2]], descriptors ) 
		equal( nq.descriptorOf( "first" ), descriptors[0] )
		equal( nq.descriptorOf( "second" ), descriptors[2] )
		equal( nq.descriptorOf( "third" ), descriptors[1] )
		equal( nq.length, 3 )
	}
	
	@test("batchEnqueue with buffer and offset") batchEnqueueBufferOffset() {
		const descriptors = [-1,-1,-1]
		const nq = new PriorityQueue<string,number>( undefined )
		nq.batchEnqueue( [["first",1],["third",3],["second",2]], descriptors, 2 ) 
		equal( nq.descriptorOf( "first" ), descriptors[2] )
		equal( nq.descriptorOf( "second" ), descriptors[4] )
		equal( nq.descriptorOf( "third" ), descriptors[3] )
		equal( nq.length, 3 )
	}

	@test("clear method clears items (only if not empty)") clearCase() {
		const nq = new PriorityQueue<string,number>()
		equal( nq.length, 0 )
		nq.clear()
		equal( nq.length, 0 )
		nq.enqueue( "second", 2 )
		nq.enqueue( "first", 1 )
		nq.enqueue( "third", 3 )
		equal( nq.length, 3 )
		equal( nq.isEmpty(), false )
		nq.clear()
		equal( nq.length, 0 )
		equal( nq.isEmpty(), true )
	}
}
