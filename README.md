Priority queue
==============

Priority queue implemented with indirect binary heap. Implementation allows
fast peek, enqueue, dequeue, update priority, delete from heap. Also includes
method for fast converting array into heap.


## constructor(comparator = DEFAULT\_COMPARATOR, values?: T[], priorities?: P[])

Create new queue. By default uses `comparator` for **minimal heap**, i.e. item with
the smallest priority will dequeue first. If `values` passed uses `batchEnqueue`
method


## enqueue(newElement: T, priority?: P): boolean

Enqueue `newElement` into queue. If `priority` is passed overwrites `newElement`
priority field with it. Return `true` if element succesfully added. Returns `false`
if newElement is already in the queue


## batchEnqueue(newElements: T[], priorities?: P[]): number 

Enqueue list of elements using efficient Floyd's algorithm. It's effiecient if
number of inserting elements is high compared to size of the heap. Ideal case is
when heap is empty


## dequeue(): T | undefined

Dequeue element from queue. If queue is empty returns `undefined`


## peek(): T | undefined

Returns element with the highest priority of `undefined` if queue is empty


## has(element: T): boolean

Returns `true` if the `element` is in the queue and `false` otherwise


## clear(): boolean

If queue has items than clears them and returns `true`. Otherwise returns `false`


## delete(element: T): boolean

If queue contains specified `element` then this function removes it from the
queue and returns `true`. Otherwise returns `false`. Because queue implemented
using indirect approach this operation is fast


## update(element: T, priority? P)

Updates `element` priority. This is the same as `enqueue` after `delete` 
