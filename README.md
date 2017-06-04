[Built status](https://travis-ci.org/iskolbin/tspriorityqueue.svg?branch=master)

Priority queue
==============

Priority queue implemented with indirect binary heap. Implementation allows
fast peek, enqueue, dequeue, update priority, delete from heap.


## constructor(comparator = DEFAULT\_COMPARATOR, arraylike?: \[T,P][], buffer?: number[], offset?: number)

Creates new queue. By default uses `comparator` for **minimal heap**, i.e. item with
the smallest priority will dequeue first. If `arraylike` is passed populate queue
using `batchEnqueue` method


## length

Property returning size of the queue


## isEmpty

Yields `true` if `length` is zero and `false` otherwise


## enqueue(element: T, priority: P): number

Enqueues `element` into the queue with specified `priority`. Returns descriptor 
which maps for efficent `update` and `delete` method. It's ok to enqueue already
enqueued element, even with the same priority


## batchEnqueue(arraylike: \[T,P][], buffer?: number[], offset?: number): number[]

Enqueues list of elements using efficient Floyd's algorithm. It's effiecient if
number of inserting elements is high compared to size of the heap. Ideal case is
when heap is empty. If buffer is specifed populates it with descriptors (see
`enqueue`. Also you can pass `offset` in this case populate buffer starting with
passed index. Returns descriptors array if `buffer` is passed or default empty
array


## dequeue(): T | undefined

Dequeue element from queue. If queue is empty returns `undefined`


## first(): T | undefined

Returns element with the highest priority or `undefined` if the queue is empty


## firstPriority(): P | undefined

Returns highest priority of the queue or `undefined` if the queue is empty


## has(element: T, descriptor?: number): boolean

Returns `true` if the `element` is in the queue and `false` otherwise. If
`descriptor` is specified checks that `element` is mapped be `descriptor`,
i.e. with wrong `descriptor` yields false even if `element` is in the
queue. Without `descriptor` method is O(n)


## descriptorOf(element: T): number

Returns descriptor of `element`. This is slow O(n) operation. If element is not
in the queue returns `-1`


## clear(): boolean

If queue has items clears them and returns `true`. Otherwise returns `false`


## delete(element: T, descriptor?: number): boolean

If queue contains specified `element` then this function removes it from the
queue and returns `true`. Otherwise returns `false`. If `descriptor` is passed
this method is fast, otherwise it is slow O(n).


## update(element: T, priority: P, descriptor?: number)

Updates `element` priority. This is the same as `enqueue` after `delete`. The
only difference is that this method will not enqueue if `element` wasn't
in the queue.


## forEach( callback(element: T, priority: P, queue: PriorityQueue<T,P>), thisArg?: any )

Calls `callback` for each element and priority in the queue.
