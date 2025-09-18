const assert = require('assert');
const cp = require('child_process');
const path = require('path');

suite('Worker Test Suite', () => {
	test('worker responds to TEST_SLEEP payload', async function() {
		this.timeout(5000);
		const workerPath = path.join(__dirname, '..', 'flowquery-worker.js');
		const proc = cp.fork(workerPath);
		const result = await new Promise((resolve, reject) => {
			proc.on('message', (msg) => {
				const m = /** @type {any} */ (msg);
				if (m && m.type === 'results') resolve(m.results);
				else if (m && m.type === 'error') reject(new Error(m.message || 'unknown'));
			});
			proc.on('error', reject);
			proc.on('exit', (code) => { if (code !== 0) reject(new Error('exit ' + code)); });
			proc.send('__TEST_SLEEP__:50');
		});

		assert.ok(Array.isArray(result));
		assert.ok(result[0] && result[0].expr0 && result[0].expr0.indexOf('slept') === 0);
	});

});
