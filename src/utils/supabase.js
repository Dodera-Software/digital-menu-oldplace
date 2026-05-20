
// Mock Supabase client for UI testing without backend
import { mockMenuItems, mockCategories, mockCafeDetails } from './mockData';

const mockSupabase = {
    from: (table) => ({
        select: (columns) => ({
            then: async (callback) => {
                await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay

                let data = [];
                if (table === 'menuItems') {
                    data = mockMenuItems;
                } else if (table === 'categories') {
                    data = mockCategories;
                } else if (table === 'cafeDetails') {
                    data = [mockCafeDetails];
                }

                callback({ data, error: null });
                return { data, error: null };
            },
            catch: (callback) => {
                callback(null);
                return { data: [], error: null };
            },
            limit: (count) => ({
                then: async (callback) => {
                    await new Promise(resolve => setTimeout(resolve, 300));

                    let data = [];
                    if (table === 'cafeDetails') {
                        data = [mockCafeDetails];
                    }

                    callback({ data, error: null });
                    return { data, error: null };
                },
                catch: (callback) => {
                    callback(null);
                    return { data: [], error: null };
                },
                single: () => ({
                    then: async (callback) => {
                        await new Promise(resolve => setTimeout(resolve, 300));
                        callback({ data: mockCafeDetails, error: null });
                        return { data: mockCafeDetails, error: null };
                    },
                    catch: (callback) => {
                        callback(null);
                        return { data: null, error: null };
                    },
                }),
            }),
            order: (column) => ({
                then: async (callback) => {
                    await new Promise(resolve => setTimeout(resolve, 300));

                    let data = [];
                    if (table === 'categories') {
                        data = mockCategories;
                    }

                    callback({ data, error: null });
                    return { data, error: null };
                },
                catch: (callback) => {
                    callback(null);
                    return { data: [], error: null };
                },
            }),
        }),
    }),
    storage: {
        from: () => ({
            upload: async () => ({ data: null, error: null }),
            getPublicUrl: (path) => ({ data: { publicUrl: 'https://placeholder.com' } }),
        }),
    },
};

export default mockSupabase;
