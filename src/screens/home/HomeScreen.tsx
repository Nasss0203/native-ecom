import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { findAllProduct } from '../../common/api/product.api';
import CardProduct from '../../components/card/CardProduct';
import SkeletonCardProduct from '../../components/card/SkeletonCardProduct';
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
  const isLoading = status === 'pending' && !data;
  const isError = status === 'error';

  // dữ liệu skeleton ảo
  const skeletonItems = React.useMemo(
    () => Array.from({ length: 6 }, (_, i) => ({ id: `skeleton-${i}` })),
    [],
  );

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text>Không tải được sản phẩm.</Text>
      </View>
    );
  }

  const listData = isLoading ? skeletonItems : items;

  return (
    <FlatList
      data={listData}
      keyExtractor={item => item.id}
      numColumns={2}
      columnWrapperStyle={styles.column}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) =>
        isLoading ? (
          <SkeletonCardProduct />
        ) : (
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
        )
      }
      showsVerticalScrollIndicator={false}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage && !isLoading) {
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
    justifyContent: 'space-between',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
