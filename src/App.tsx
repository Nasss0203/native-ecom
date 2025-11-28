/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';
const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <RootNavigator />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}

export default App;

// export default function App() {
//   return (
//     <View style={styles.outer}>
//       <View style={[styles.inner]}>
//         <View style={[styles.box, { backgroundColor: '#ff3b30' }]} />
//         <View style={[styles.box, { backgroundColor: '#34c759' }]} />
//       </View>

//       <View style={[styles.inner]}>
//         <View style={[styles.box, { backgroundColor: '#007aff' }]} />
//         <View style={[styles.box, { backgroundColor: '#ffcccb' }]} />
//       </View>
//     </View>
//   );
// }

// const BOX = 50;

// const styles = StyleSheet.create({
//   outer: {
//     flex: 1,
//     justifyContent: 'space-between',
//   },
//   inner: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   box: {
//     width: BOX,
//     height: BOX,
//   },
// });
