import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,TouchableOpacity  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProfileScreen from './ProfileScreen';
import SearchPage from './Recherche';
import Icon from 'react-native-vector-icons/FontAwesome';
import GraphScreen from './ProfessorCombinaison';



const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInProfEmail, setLoggedInProfEmail] = useState('');
const [isInvalidEmail, setIsInvalidEmail] = useState(false);
const [isLoginSuccess, setIsLoginSuccess] = useState(false);
const handleLogin = async () => {
  if (!email || !motDePasse) {
    console.error('Veuillez remplir tous les champs.');
    return;
  }

  try {
    const response = await fetch('https://tiny-worm-nightgown.cyclic.app/professeurs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: motDePasse,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Connexion réussie:', data);

      setIsLoggedIn(true);
      setLoggedInProfEmail(email);
      setEmail('');
      setMotDePasse('');
      setIsLoginSuccess(true); // Afficher le popup de connexion réussie
    } else {
      const error = await response.json();
      console.error('Échec de la connexion:', error.message);
      setIsInvalidEmail(true); // Afficher le popup d'email invalide
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};


  const Tab = createBottomTabNavigator();

if (isLoggedIn) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Profile') {
            iconName = focused ? 'user' : 'user-o';
             iconColor = 'green';
          } else if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search';
            iconColor =  'red' ;

          }else if (route.name === 'Combinaison') {
        iconName = focused ? 'shape' : 'shape-outline';
        iconColor = 'purple';
      }

          // Retourne l'icône de profil
          return <Icon name={iconName} size={size} color={iconColor} />;
        },
      })}
    >
      <Tab.Screen name="Profile">
        {() => <ProfileScreen loggedInProfEmail={loggedInProfEmail} />}
      </Tab.Screen>
      <Tab.Screen name="Search" component={SearchPage} />
        <Tab.Screen name="Combinaison" component={GraphScreen} />
    </Tab.Navigator>

  );
}


return (
  <View style={styles.container}>
            <Text>            </Text>

        <Text style={styles.title}> Login : </Text>
          <Text>            </Text>
          <Text>            </Text>
        <Text>            </Text>


      <Text style={styles.text}> identification : </Text>
          <Text>            </Text>


    <TextInput
      style={styles.input}
      placeholder="Email"
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
    />
    <Text  style={styles.text}>Mot de Passe : </Text>
    <Text>            </Text>
    <TextInput
      style={styles.input}
      placeholder="Mot de passe"
      value={motDePasse}
      onChangeText={setMotDePasse}
      secureTextEntry
    />

 <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    {isInvalidEmail && (
      <View style={styles.popup}>
        <Text style={styles.popupText}>Email ou mot de passe invalide</Text>
      </View>
    )}

    {isLoginSuccess && (
      <View style={styles.popup}>
        <Text style={styles.popupText} color="red">Connexion réussie</Text>
      </View>
    )}
  </View>
);

};

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello!</Text>
    </View>
  );
};

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher</Text>
    </View>
  );
};

const RegistrationForm = () => {
  // Ajouter le code de RegistrationForm ici
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 12,
    paddingLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
        alignItems: 'center',


  },
  text:{
    fontSize: 18,
        alignItems: 'center',

  },
 button: {
    backgroundColor: 'green',
    borderRadius: 5,
    paddingVertical: 10,
    marginTop: 30,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
popupText: {
  color: "red",
}

});

export default LoginForm;