const expect = require('expect');
const { generateMessage } = require('./message');

describe('Generate message', () => {
    it('should generate correct message object', () => {
        let from = 'Jen';
        let text = 'Some message';
        let message = generateMessage(from, text);
        expect(message).toHaveProperty('from', from);
        expect(message).toHaveProperty('text', text);
        expect(message.createdAt).toBeA('number');
    });
});
