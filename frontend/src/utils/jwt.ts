import jwtDecode from 'jwt-decode';

export function jwt<T>(token: unknown): T | null {
  try {
    return jwtDecode(token as string);
  } catch (e) {
    console.warn(e);
    return null;
  }
}
