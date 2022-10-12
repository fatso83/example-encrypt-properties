const assert = require('assert/strict')
const t = require('./tools')


const tests = [
    () => {
        const input = "simple_prop=1234"

        assert.equal(t.extractPropertyName(input), 'simple_prop')
        assert.equal(t.extractPropertyValue(input), '1234')
        assert.equal(t.extractEncryptedString(input), null)
    },
    () => {
        const input = "encrypted_prop=ENC(bla)"

        assert.equal(t.extractPropertyName(input), 'encrypted_prop')
        assert.equal(t.extractPropertyValue(input), 'ENC(bla)')
        assert.equal(t.extractEncryptedString(input), 'bla')
    },
    () => {
        const input = ""

        assert.equal(t.extractPropertyName(input), null)
        assert.equal(t.extractPropertyValue(input), null)
        assert.equal(t.extractEncryptedString(input), null)
    },
    () => {
        const input = "# comment"

        assert.equal(t.extractPropertyName(input), null)
        assert.equal(t.extractPropertyValue(input), null)
        assert.equal(t.extractEncryptedString(input), null)
    },
    () => {
        // verify that the lookup for the first `=` is lazy (matching on the first instance, not the `=` within the encrypted string
        const input = "idp_code_flow_client_secret=ENC(wGnAkYi3YsPXlh9yAVmPq/3ai1l6GzPKeI9s5CTJqlJQftn4A93MK24LLR2l6MA/ae+XUhxk3I/j+qYqeyB3Q589t4wciFnN0pI/WhZxSMs=08514adf-7f54-470f-8f0f-fa62bfe1a8e4)"

        assert.equal(t.extractPropertyName(input), 'idp_code_flow_client_secret')
        assert.equal(t.extractPropertyValue(input), 'ENC(wGnAkYi3YsPXlh9yAVmPq/3ai1l6GzPKeI9s5CTJqlJQftn4A93MK24LLR2l6MA/ae+XUhxk3I/j+qYqeyB3Q589t4wciFnN0pI/WhZxSMs=08514adf-7f54-470f-8f0f-fa62bfe1a8e4)')
        assert.equal(t.extractEncryptedString(input), 'wGnAkYi3YsPXlh9yAVmPq/3ai1l6GzPKeI9s5CTJqlJQftn4A93MK24LLR2l6MA/ae+XUhxk3I/j+qYqeyB3Q589t4wciFnN0pI/WhZxSMs=08514adf-7f54-470f-8f0f-fa62bfe1a8e4')
    }
]

tests.forEach(test => test())


