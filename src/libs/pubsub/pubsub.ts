import PubSub from 'pubsub-js';

export interface PubSubMessageDataMap {
	ScrollPost: {};
	ScrollMedia: { direction: 1 | -1 };
	RevealMedia: { mediaId: number };
	AppMounted: {};
}

// Define a type for message names
export type PubSubMsgType = keyof PubSubMessageDataMap;

export default new (class TypedPubSub {
	subscribe<T extends PubSubMsgType>(messageType: T, callback: (data: PubSubMessageDataMap[T]) => void): string {
		return PubSub.subscribe(messageType, (msg, data) => callback(data as PubSubMessageDataMap[T]));
	}

	publish<T extends PubSubMsgType>(messageType: T, data: PubSubMessageDataMap[T]): boolean {
		return PubSub.publish(messageType, data);
	}

	unsubscribe(token: string): void {
		PubSub.unsubscribe(token);
	}
})();
