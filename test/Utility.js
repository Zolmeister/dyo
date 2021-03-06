describe('Utility', () => {
	const Symbol = globalThis.Symbol
	const Promise = globalThis.Promise
	const setTimeout = globalThis.setTimeout
	const requestAnimationFrame = globalThis.requestAnimationFrame

	before(() => globalThis.Symbol = ''), after(() => globalThis.Symbol = Symbol)
	before(() => globalThis.Promise = ''), after(() => globalThis.Promise = Promise)
	before(() => globalThis.setTimeout = ''), after(() => globalThis.setTimeout = setTimeout)
	before(() => globalThis.requestAnimationFrame = ''), after(() => globalThis.requestAnimationFrame = requestAnimationFrame)

	it('should support iterator fallbacks', async () => {
		const {syncIterator, asyncIterator} = await import('../src/Utility.js?0')

		assert.deepEqual([syncIterator, asyncIterator], ['@@iterator', '@@asyncIterator'])
	})

	it('should support deferred polyfill initialization', async () => {
		const {promise, timeout, animation} = await import('../src/Utility.js?1')

		globalThis.Promise = Promise
		globalThis.setTimeout = setTimeout

		assert.doesNotThrow(() => {
			assert(new promise(() => {}))
			assert(timeout(() => {}, 0))
			assert(animation(() => {}))
		})
	})
})
