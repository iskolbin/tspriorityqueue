import { Priority } from './Priority'

export class PriorityQueue<T extends Priority<P>,P> {
	static DEFAULT_COMPARATOR = ( a: any, b:any ): number => {
		if ( a < b ) {
			return -1
		} else if ( a > b ) {
			return 1
		} else {
			return 0
		}
	}

	protected elements: T[] = []
	protected comparator: (a: P, b: P) => number 

	get length() {
		return this.elements.length
	}

	constructor( 
		comparator: (a: P, b: P) => number = PriorityQueue.DEFAULT_COMPARATOR,
		elements?: T[],
		priorities?: P[]
	) {
		this.comparator = comparator
		if ( elements !== undefined ) {
			this.batchEnqueue( elements, priorities )
		}
	}

	enqueue( newElement: T, priority?: P ): boolean {
		if ( newElement.queueIndex < 0 ) { 
			const index = this.elements.length
			newElement.queueIndex = index
			if ( priority !== undefined ) {
				newElement.priority = priority
			}
			this.elements.push( newElement )
			this.siftUp( index )
			return true
		} else {
			return false
		}
	}

	batchEnqueue( newElements: T[], priorities?: P[] ): number {
		const elements = this.elements
		//let innerIndex = 0
		let notInserted = 0
		for ( let i = 0, len = newElements.length; i < len; i++ ) {
			const newElement = newElements[i]//of newElements ) {
			if ( newElement.queueIndex >= 0 ) {
				notInserted++
			} else {
				newElement.queueIndex = elements.length
				if ( priorities !== undefined && i < priorities.length ) {//innerIndex ) {
					newElement.priority = priorities[i]
				}
				elements.push( newElement )
			}
			//innerIndex++
		}
		this.algorithmFloyd()
		return notInserted
	}

	dequeue(): T | undefined {
		const newRoot = this.elements.pop()
		if ( newRoot !== undefined ) {
			const {elements} = this
			if ( elements.length === 0 ) {
				newRoot.queueIndex = -1
				return newRoot
			} else {
				const element = this.elements[0]
				element.queueIndex = -1
				this.elements[0] = newRoot
				this.elements[0].queueIndex = 0
				this.siftDownFloyd( 0 )
				return element
			} 
		} else {
			return undefined
		}
	}

	peek(): T | undefined {
		return this.elements.length > 0 ? this.elements[0] : undefined
	}

	has( element: T ): boolean {
		const index = element.queueIndex
		return index >= 0 && this.elements[index] === element
	}

	update( element: T, priority?: P ): boolean {
		if ( (priority === undefined || element.priority !== priority) && this.delete( element )) {
			return this.enqueue( element, priority )
		} else {
			return false
		}
	}

	delete( element: T ): boolean {
		const index = element.queueIndex
		const elements = this.elements
		if ( this.has( element )) {
			element.queueIndex = -1
			const lastElement = elements.pop()
			if ( lastElement !== undefined && lastElement !== element ) {
				elements[index] = lastElement
				lastElement.queueIndex = index
				if ( this.length > 1 ) {
					this.siftDown( this.siftUp( index ))
				}
			}
			return true
		} else {
			return false
		}
	}

	forEach<Z>( callbackFn: (this: Z, element: T, index: number, pq: this) => void, thisArg?: Z ): void {
		for ( const element of this.elements ) {
			callbackFn.call( thisArg, element, element.queueIndex, this )
		}
	}

	protected siftUp( at: number ): number {
		let index = at
		let parentIndex = (index-1) >> 1
		const {elements, comparator} = this
		while ( index > 0 && comparator( elements[index].priority, elements[parentIndex].priority ) < 0 ) {
			this.swap( index, parentIndex )
			index = parentIndex
			parentIndex = (index-1) >> 1
		}
		return index
	}

	protected siftDownFloyd( at: number ): void {
		let index = at
		let leftIndex = (index << 1) + 1
		let rightIndex = leftIndex + 1
		const { elements, length, comparator } = this
		while ( leftIndex < length ) {
			const higherPriorityIndex = ( rightIndex < length && comparator( elements[rightIndex].priority, elements[leftIndex].priority ) < 0 ) ? rightIndex : leftIndex
			this.swap( index, higherPriorityIndex )
			index = higherPriorityIndex
			leftIndex = (index << 1) + 1
			rightIndex = leftIndex + 1
		}
		this.siftUp( index )
	}
	
	protected siftDown( at: number ): void {
		let index = at
		let leftIndex = (index << 1) + 1
		let rightIndex = leftIndex + 1
		const { elements, length, comparator } = this
		while ( leftIndex < length ) {
			const higherPriorityIndex = ( rightIndex < length && comparator( elements[rightIndex].priority, elements[leftIndex].priority ) < 0 ) ? rightIndex : leftIndex
			if ( comparator( elements[index].priority, elements[higherPriorityIndex].priority ) < 0 ) {
				break
			}
			this.swap( index, higherPriorityIndex )
			index = higherPriorityIndex
			leftIndex = (index << 1) + 1
			rightIndex = leftIndex + 1
		}
	}

	protected algorithmFloyd(): void {
		const n = this.length >> 1
		for ( let i = n-1; i >= 0; i-- ) {
			this.siftDown( i ) 
		}
	}

	protected swap( i: number, j: number ): void {
		const temp = this.elements[i]
		this.elements[i] = this.elements[j]
		this.elements[i].queueIndex = i
		this.elements[j] = temp
		this.elements[j].queueIndex = j
	}
}
