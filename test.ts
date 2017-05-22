import { PriorityQueue } from './src/PriorityQueue'
import { Priority } from './src/Priority'
import { suite, test } from 'mocha-typescript'
import { equal, deepEqual } from 'assert'

class NumberQueueItem<T> implements Priority<number> {
	queueIndex: number = -1
	priority: number = 0
	value: T

	constructor( value: T ) {
		this.value = value
	}
}

class NumberQueue<T> extends PriorityQueue<NumberQueueItem<T>,number> {
}

@suite class PriorityQueueTestSute {
	@test("length") case1() {
		const nq = new NumberQueue<string>()
		equal( nq.length, 0 )
		nq.enqueue( new NumberQueueItem<string>(""))
		equal( nq.length, 1 )
		nq.enqueue( new NumberQueueItem<string>(""))
		equal( nq.length, 2 )
		nq.enqueue( new NumberQueueItem<string>(""))
		equal( nq.length, 3 )
		nq.dequeue()
		equal( nq.length, 2 )
		nq.enqueue( new NumberQueueItem<string>(""))
		equal( nq.length, 3 )
		nq.dequeue()
		equal( nq.length, 2 )
		nq.dequeue()
		equal( nq.length, 1 )
		nq.dequeue()
		equal( nq.length, 0 )
	}

	@test("enqueue not queued returns true") case2() {
		const nq = new NumberQueue<string>()
		equal( nq.enqueue( new NumberQueueItem<string>("")), true )
	}

	@test("enqueue queued returns false") case3() {
		const nq = new NumberQueue<string>()
		const item = new NumberQueueItem<string>("")
		equal( nq.length, 0 )
		equal( nq.enqueue( item ), true )
		equal( nq.length, 1 )
		equal( nq.enqueue( item ), false )
		equal( nq.length, 1 )
	}

	@test("dequeue from empty returns undefined") case4() {
		const nq = new NumberQueue<string>()
		equal( nq.length, 0 )
		equal( nq.dequeue(), undefined )
	}

	@test("default comparator: min heap") case5() {
		const nq = new NumberQueue<string>()
		equal( nq.length, 0 )
		nq.enqueue( new NumberQueueItem<string>( "second" ), 2 )
		nq.enqueue( new NumberQueueItem<string>( "first" ), 1 )
		nq.enqueue( new NumberQueueItem<string>( "third") , 3 )
		equal( nq.length, 3 )
		equal( nq.dequeue().value, "first" )
		equal( nq.dequeue().value, "second" )
		equal( nq.dequeue().value, "third" )
		equal( nq.length, 0 )
	}

	@test("custom comparator: max heap") case6() {
		const nq = new NumberQueue<string>( (a: number, b: number): number => a > b ? -1 : a < b ? 1 : 0 )
		equal( nq.length, 0 )
		nq.enqueue( new NumberQueueItem<string>( "second" ), 2 )
		nq.enqueue( new NumberQueueItem<string>( "first" ), 3 )
		nq.enqueue( new NumberQueueItem<string>( "third") , 1 )
		equal( nq.length, 3 )
		equal( nq.dequeue().value, "first" )
		equal( nq.dequeue().value, "second" )
		equal( nq.dequeue().value, "third" )
		equal( nq.length, 0 )
	}

	@test("has and not has") case7() {
		const nq = new NumberQueue<string>()
		const item = new NumberQueueItem<string>("")
		const item2 = new NumberQueueItem<string>("")
		equal( nq.enqueue( item ), true )
		equal( nq.has( item ), true )
		equal( nq.has( item2 ), false )
		nq.enqueue( item2 )
		equal( nq.has( item2 ), true )
		equal( nq.length, 2 )
	}

	@test("has") case8() {
		const nq = new NumberQueue<string>()
		const item = new NumberQueueItem<string>("")
		equal( nq.enqueue( item ), true )
		equal( nq.has( item ), true )
	}

	@test("not has") case9() {
		const nq = new NumberQueue<string>()
		const item = new NumberQueueItem<string>("")
		equal( nq.has( item ), false )
	}

	@test("update queued and not queued") case10() {
		const nq = new NumberQueue<string>()
		const item = new NumberQueueItem<string>("")
		const item2 = new NumberQueueItem<string>("")
		nq.enqueue( item, 5 )
		equal( item.priority, 5 )
		equal( nq.update( item, 10 ), true )
		equal( item.priority, 10 )
		equal( nq.update( item2, 15 ), false )
	}

	@test("update queued") case11() {
		const nq = new NumberQueue<string>()
		const item = new NumberQueueItem<string>("")
		nq.enqueue( item, 5 )
		equal( item.priority, 5 )
		equal( nq.update( item, 10 ), true )
		equal( item.priority, 10 )
	}

	@test("update not queued") case12() {
		const nq = new NumberQueue<string>()
		const item = new NumberQueueItem<string>("")
		item.priority = 5
		equal( nq.update( item, 10 ), false )
		equal( item.priority, 5 )
	}

	@test("delete queued") case13() {
		const nq = new NumberQueue<string>()
		const item = new NumberQueueItem<string>("")
		nq.enqueue( item )
		equal( nq.delete( item ), true )
		equal( nq.delete( item ), false )
		equal( nq.length, 0 )
	}
	
	@test("delete 2 queued") case14() {
		const nq = new NumberQueue<string>()
		const item = new NumberQueueItem<string>("")
		const item2 = new NumberQueueItem<string>("")
		nq.enqueue( item )
		nq.enqueue( item2 )
		equal( nq.delete( item ), true )
		equal( nq.delete( item2 ), true )
		equal( nq.length, 0 )
	}
	
	@test("delete 10 queued") case15() {
		const nq = new NumberQueue<string>()
		const items = [0,1,2,3,4,5,6,7,8,9].map( i => new NumberQueueItem<string>(""))
		items.forEach( e => {
			equal( nq.enqueue( e ), true )
		})
		equal( nq.length, items.length )
		items.forEach( e => {
			equal( nq.delete( e ), true )
		})
		equal( nq.length, 0 )
	}

	@test("batch enqueue") case16() {
		const nq = new NumberQueue<string>()
		const priorities = [9,3,1,4,2,5,8,7,6,0]
		const items = priorities.map( i => new NumberQueueItem<string>(`${i}`))
		nq.batchEnqueue( items, priorities )
		priorities.sort()
		while ( nq.length > 0 ) {
			equal( nq.dequeue().value, `${priorities.shift()}`)
		}
	}
	
	@test("batch enqueue 1 element") case17() {
		const nq = new NumberQueue<string>()
		const priorities = [0]
		const items = priorities.map( i => new NumberQueueItem<string>(`${i}`))
		nq.batchEnqueue( items, priorities )
		priorities.sort()
		while ( nq.length > 0 ) {
			equal( nq.dequeue().value, `${priorities.shift()}`)
		}
	}
	
	@test("batch enqueue already queued") case18() {
		const nq = new NumberQueue<string>()
		const priorities = [9,3,1,4,2,5,8,7,6,0]
		const items = priorities.map( i => new NumberQueueItem<string>(`${i}`))
		equal( nq.batchEnqueue( items, priorities ), 0 )
		equal( nq.batchEnqueue( items, priorities ), 10 )
		priorities.sort()
		while ( nq.length > 0 ) {
			equal( nq.dequeue().value, `${priorities.shift()}`)
		}
	}
	
	@test("constructor with args") case19() {
		const priorities = [9,3,1,4,2,5,8,7,6,0]
		const items = priorities.map( i => new NumberQueueItem<string>(`${i}`))
		const nq = new NumberQueue<string>( undefined, items, priorities )
		priorities.sort()
		while ( nq.length > 0 ) {
			equal( nq.dequeue().value, `${priorities.shift()}`)
		}
	}
	
	@test("batch enqueue with 11 items and 10 priorities") case20() {
		const nq = new NumberQueue<string>()
		const priorities = [9,3,1,4,2,5,8,7,6,0]
		const items = priorities.map( i => new NumberQueueItem<string>(`${i}`))
		const lastItem = new NumberQueueItem<string>("11")
		lastItem.priority = 11
		items.push( lastItem )
		nq.batchEnqueue( items, priorities )
		priorities.sort()
		while ( priorities.length > 0 ) {
			equal( nq.dequeue().value, `${priorities.shift()}`)
		}
		equal( nq.dequeue().value, "11" )
	}
	
	@test("peek 1") case21() {
		const nq = new NumberQueue<string>()
		nq.enqueue( new NumberQueueItem<string>( "0" ))
		equal( nq.peek().value, "0" )
	}
	
	@test("peek 3") case22() {
		const nq = new NumberQueue<string>()
		equal( nq.length, 0 )
		nq.enqueue( new NumberQueueItem<string>( "second" ), 2 )
		nq.enqueue( new NumberQueueItem<string>( "first" ), 1 )
		nq.enqueue( new NumberQueueItem<string>( "third") , 3 )
		equal( nq.peek().value, "first" )
	}

	@test("peek n") case23() {
		const priorities = [9,3,1,4,2,5,8,7,6,0]
		const items = priorities.map( i => new NumberQueueItem<string>(`${i}`))
		const nq = new NumberQueue<string>( undefined, items, priorities )
		equal( nq.peek().value, "0" )
	}
	
	@test("peek 0") case24() {
		const nq = new NumberQueue<string>()
		equal( nq.peek(), undefined )
	}

	@test("forEach") case25() {
		const priorities = [9,3,1,4,2,5,8,7,6,0]
		const items = priorities.map( i => new NumberQueueItem<string>(`${i}`))
		const nq = new NumberQueue<string>( undefined, items, priorities )
		let counter = 0
		nq.forEach( (v,i,nq_) => {
			equal( nq, nq )
			equal( i, counter )
			equal( v.value, `${v.priority}` )
			counter++
		})
	}

	@test("empty test") case26() {
		const nq = new NumberQueue<string>( (a: number, b: number): number => a > b ? -1 : a < b ? 1 : 0 )
		equal( nq.isEmpty(), true )
		nq.enqueue( new NumberQueueItem<string>( "second" ), 2 )
		nq.enqueue( new NumberQueueItem<string>( "first" ), 3 )
		nq.enqueue( new NumberQueueItem<string>( "third") , 1 )
		equal( nq.isEmpty(), false )
		equal( nq.dequeue().value, "first" )
		equal( nq.dequeue().value, "second" )
		equal( nq.dequeue().value, "third" )
		equal( nq.isEmpty(), true )
	}

	@test("clear test") case27() {
		const nq = new NumberQueue<string>()
		equal( nq.isEmpty(), true )
		equal( nq.clear(), false )
		nq.enqueue( new NumberQueueItem<string>( "first" ), -30 )
		nq.enqueue( new NumberQueueItem<string>( "third") , -10 )
		nq.enqueue( new NumberQueueItem<string>( "second" ), -20 )
		equal( nq.isEmpty(), false )
		equal( nq.clear(), true )
		equal( nq.isEmpty(), true )
	}
}
