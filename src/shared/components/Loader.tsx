import {ActivityIndicator, MD2Colors} from 'react-native-paper';

const Loader = () => {
  return <ActivityIndicator animating={true} color={MD2Colors.white} />;
};

export default Loader;
