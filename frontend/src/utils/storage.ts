type LOCAL_STORAGE_KEYS = 'token';

export function getLocalStorage<T>(key: LOCAL_STORAGE_KEYS): T | null {
  try {
    const serializedState = localStorage.getItem(key);
    return serializedState ? JSON.parse(serializedState) : null;
  } catch (err) {
    console.warn(err);
    return null;
  }
}

export const saveLocalStorage = (key: LOCAL_STORAGE_KEYS, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value || null));
  } catch (err) {
    console.warn(err);
  }
};

export const removeLocalStorage = (key: LOCAL_STORAGE_KEYS) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn(err);
  }
};
