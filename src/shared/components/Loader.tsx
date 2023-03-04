import {ActivityIndicator, MD2Colors} from 'react-native-paper';

type Props = {
  dark?: boolean;
};

const Loader = ({dark = false}: Props) => {
  return (
    <ActivityIndicator
      animating={true}
      color={dark ? MD2Colors.black : MD2Colors.white}
    />
  );
};

export default Loader;
