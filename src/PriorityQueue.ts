export class PriorityQueue<T,P> {
	static DESCRIPTORS_NULL_BUFFER: number[] = []

	static DEFAULT_COMPARATOR = ( a: any, b: any ): number => {
		if ( a < b ) {
			return -1
		} else if ( a > b ) {
			return 1
		} else {
			return 0
		}
	}

	protected elements: T[] = []
	protected priorities: P[] = []
	protected descriptorToIndex: number[] = []
	protected indexToDescriptor: number[] = []
	protected releasedDescriptors: number[] = []
	protected comparator: ( a: P, b: P ) => number

	get length() {
		return this.elements.length
	}

	isEmpty() {
		return this.elements.length === 0
	}

	constructor( 
		comparator: (a: P, b: P) => number = PriorityQueue.DEFAULT_COMPARATOR,
		arraylike?: [T,P][],
		descriptorBuffer = PriorityQueue.DESCRIPTORS_NULL_BUFFER,
		descriptorBufferOffset = 0
	) {
		this.comparator = comparator
		if ( arraylike !== undefined ) {
			this.batchEnqueue( arraylike, descriptorBuffer, descriptorBufferOffset )
		}
	}

	enqueue( newElement: T, newPriority: P ): number {
		const len = this.length
		const releasedDescriptor = this.releasedDescriptors.pop()
		const descriptor = releasedDescriptor !== undefined ? releasedDescriptor: len
		this.elements.push( newElement )
		this.priorities.push( newPriority )
		this.indexToDescriptor[len] = descriptor
		this.descriptorToIndex[descriptor] = len
		this.siftUp( len )
		return descriptor
	}

	batchEnqueue(
		arraylike: [T,P][],
		descriptorBuffer = PriorityQueue.DESCRIPTORS_NULL_BUFFER,
		descriptorBufferOffset = 0
	): number[] {
		const descriptors: number[] = []
		const {elements, priorities, descriptorToIndex, indexToDescriptor, releasedDescriptors, length} = this
		const len = arraylike.length
		for ( let i = 0; i < len; i++ ) {
			const [newElement,newPriority] = arraylike[i]
			const newIndex = length + i
			const releasedDescriptor = releasedDescriptors.pop()
			const descriptor = releasedDescriptor !== undefined ? releasedDescriptor : newIndex
			elements.push( newElement )
			priorities.push( newPriority )
			indexToDescriptor[newIndex] = descriptor
			descriptorToIndex[descriptor] = newIndex
			if ( descriptorBuffer !== PriorityQueue.DESCRIPTORS_NULL_BUFFER ) {
				descriptorBuffer[i + descriptorBufferOffset] = descriptor
			}
		}
		this.algorithmFloyd()
		return descriptors
	}

	dequeue(): T | undefined {
		if ( this.isEmpty()) {
			return undefined
		} else {
			const element = this.elements[0]
			const descriptor = this.indexToDescriptor[0]
			const lastIndex = this.length - 1
			if ( lastIndex > 0 ) {
				this.swap( 0, lastIndex )
			}
			this.indexToDescriptor[lastIndex] = -1
			this.descriptorToIndex[descriptor] = -1
			this.releasedDescriptors.push( descriptor )
			this.elements.pop()
			this.priorities.pop()
			this.siftDownFloyd( 0 )
			return element
		}
	}

	first(): T | undefined {
		return this.elements.length > 0 ? this.elements[0] : undefined
	}

	firstPriority(): P | undefined {
		return this.priorities.length > 0 ? this.priorities[0] : undefined
	}

	has( element: T, descriptor: number = this.descriptorOf( element )): boolean {
		return this.elements[this.descriptorToIndex[descriptor]] === element
	}

	clear(): boolean {
		if ( !this.isEmpty() ) {
			this.elements = []
			this.priorities = []
			this.indexToDescriptor = []
			this.descriptorToIndex = []
			this.releasedDescriptors = []
			return true
		} else {
			return false
		}
	}

	update( element: T, priority: P, descriptor: number = this.descriptorOf( element )): number {
		if ( this.delete( element, descriptor )) {
			return this.enqueue( element, priority )
		} else {
			return -1
		}
	}

	delete( element: T, descriptor: number = this.descriptorOf( element )): boolean {
		if ( this.has( element, descriptor )) {
			const index = this.descriptorToIndex[descriptor]
			const lastIndex = this.length - 1
			if ( lastIndex > 0 && lastIndex !== index ) {
				this.swap( index, lastIndex )
			}
			this.indexToDescriptor[lastIndex] = -1
			this.descriptorToIndex[descriptor] = -1
			this.releasedDescriptors.push( descriptor )
			this.elements.pop()
			this.priorities.pop()
			if ( !this.isEmpty()) {
				this.siftDown( this.siftUp( index ))
			}
			return true
		} else {
			return false
		}
	}

	descriptorOf( element: T ): number {
		for ( let i = 0, len = this.length; i < len; i++ ) {
			if ( this.elements[i] === element ) {
				return this.indexToDescriptor[i]
			}
		}
		return -1
	}

	forEach<Z>(
		callbackFn: (this: Z, element: T, priority: P, pq: this) => void,
		thisArg?: Z
	): void {
		const {elements, priorities, length} = this
		for ( let i = 0; i < length; i++ ) {
			callbackFn.call( thisArg, elements[i], priorities[i], this )
		}
	}

	protected siftUp( at: number ): number {
		let index = at
		let parentIndex = (index-1) >> 1
		const {priorities, comparator} = this
		while ( index > 0 && comparator( priorities[index], priorities[parentIndex] ) < 0 ) {
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
		const {priorities, length, comparator} = this
		while ( leftIndex < length ) {
			const higherPriorityIndex = ( rightIndex < length && comparator( priorities[rightIndex], priorities[leftIndex] ) < 0 ) ? rightIndex : leftIndex
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
		const {priorities, length, comparator} = this
		while ( leftIndex < length ) {
			const higherPriorityIndex = ( rightIndex < length && comparator( priorities[rightIndex], priorities[leftIndex] ) < 0 ) ? rightIndex : leftIndex
			if ( comparator( priorities[index], priorities[higherPriorityIndex] ) < 0 ) {
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
		for ( let i = n - 1; i >= 0; i-- ) {
			this.siftDown( i ) 
		}
	}

	protected swap( i: number, j: number ): void {
		const tempElement = this.elements[i]
		const tempPriority = this.priorities[i]
		const tempDescriptor = this.indexToDescriptor[i]
		this.elements[i] = this.elements[j]
		this.priorities[i] = this.priorities[j]
		this.indexToDescriptor[i] = this.indexToDescriptor[j]
		this.descriptorToIndex[this.indexToDescriptor[j]] = i
		this.elements[j] = tempElement
		this.priorities[j] = tempPriority
		this.indexToDescriptor[j] = tempDescriptor
		this.descriptorToIndex[tempDescriptor] = j
	}
}
