import { EventEmitter } from 'events';

function waitForEvent(emitter: EventEmitter, event: string): Promise<void> {
	return new Promise((resolve) => {
		emitter.once(event, resolve);
	});
}

export default waitForEvent;
