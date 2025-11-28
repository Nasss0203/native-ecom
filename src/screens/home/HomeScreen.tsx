// src/screens/home/HomeScreen.tsx
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { findAllProduct } from '../../common/api/product.api';
import CardProduct from '../../components/card/CardProduct';
import { QueryKey } from '../../const/queryKey';

export default function HomeScreen({ navigation }: any) {
  const {
    data,
    error,
    status,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QueryKey.PRODUCTS],
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) =>
      findAllProduct({ page: pageParam, limit: 10 }),

    getNextPageParam: lastPage => {
      const { page, limit, total } = lastPage.data;

      return page * limit < total ? page + 1 : undefined;
    },
  });

  const items = data?.pages.flatMap(p => p.data?.data ?? []) ?? [];

  return (
    <FlatList
      data={items}
      keyExtractor={item => item._id}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <CardProduct
          item={{
            id: item._id,
            name: item.product_name,
            price: item.product_price,
            image: item.product_thumb,
          }}
          onPress={() =>
            navigation.navigate('DetailProduct', { productId: item._id })
          }
        />
      )}
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.3}
      ListFooterComponent={
        isFetchingNextPage ? (
          <ActivityIndicator size="large" style={{ padding: 16 }} />
        ) : null
      }
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingTop: 12,
    paddingBottom: 16,
  },
  column: {
    justifyContent: 'space-between', // 2 card giãn đều
  },
});
