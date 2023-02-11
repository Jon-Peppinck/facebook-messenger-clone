import {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {useMutation} from 'react-query';
import {useNavigate} from 'react-router-native';
import {Button} from 'react-native-paper';

import {register} from '../../shared/auth/requests';
import {
  COLOR_FB_PRIMARY,
  COLOR_FB_SECONDARY,
  COLOR_WHITE,
} from '../../shared/constants/colors';
import {NewUser} from '../../shared/auth/models';
import Input from '../../shared/components/Input';
import Loader from '../../shared/components/Loader';

const RegisterScreen = () => {
  const registerMutation = useMutation(
    (newUser: NewUser) => register(newUser),
    {
      onSuccess: () => {
        resetForm();
        navigate('/login');
      },
    },
  );

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setPassword('');
  };

  const registerHandler = () => {
    if (!firstName || !lastName || !email || !password) return;

    registerMutation.mutate({firstName, lastName, email, password});
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.facebookText}>facebook</Text>

        <Input
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
        />

        <Input
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
        />

        <Input placeholder="Email" value={email} onChangeText={setEmail} />

        <Input
          secure
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
        />

        <View style={styles.registerButtonContainer}>
          {registerMutation.isLoading ? (
            <Loader />
          ) : (
            <Button
              style={styles.registerButton}
              labelStyle={styles.registerButtonText}
              mode="contained"
              onPress={registerHandler}>
              Register
            </Button>
          )}
        </View>
      </View>

      <Button labelStyle={styles.signUpText} onPress={() => navigate('/login')}>
        Already a member? Log In
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: COLOR_FB_PRIMARY,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  facebookText: {
    fontSize: 56,
    fontWeight: '700',
    color: COLOR_WHITE,
    marginBottom: 32,
  },
  registerButtonContainer: {
    marginTop: 16,
    width: '100%',
  },
  registerButton: {
    backgroundColor: COLOR_FB_SECONDARY,
    height: 48,
    borderRadius: 0,
  },
  registerButtonText: {
    paddingTop: 8,
    fontSize: 24,
  },
  signUpText: {
    color: COLOR_WHITE,
    fontSize: 16,
  },
});

export default RegisterScreen;
