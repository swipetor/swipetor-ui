import { EqualityFn, useSelector } from 'react-redux';
import { UIState } from 'src/redux/reducers/reducers';

export function useUIStore<T>(selector: (store: UIState) => T, equalityFn?: EqualityFn<T>) {
	return useSelector(selector, equalityFn);
}
