import { getCurrentUser } from '@/lib/session';
import { renderHook, act } from '@testing-library/react-hooks';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('Session Library', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('should return null for unauthenticated user', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(null));

    const { result, waitForNextUpdate } = renderHook(() => getCurrentUser());

    await waitForNextUpdate();

    expect(result.current).toBeNull();
  });

  it('should return user data for authenticated user', async () => {
    const mockUser = { id: '1', email: 'test@test.com', role: 'USER' };
    fetchMock.mockResponseOnce(JSON.stringify(mockUser));

    const { result, waitForNextUpdate } = renderHook(() => getCurrentUser());

    await waitForNextUpdate();

    expect(result.current).toEqual(mockUser);
  });
});

