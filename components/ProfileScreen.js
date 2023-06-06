import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, ScrollView,Button } from 'react-native';
import MultipleSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';

const ProfileScreen = ({ loggedInProfEmail }) => {
  const [profileData, setProfileData] = useState(null);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [grades, setGrades] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [villes, setVilles] = useState([]);
  const [grade, setGrade] = useState('');
  const [specialite, setSpecialite] = useState('');
  const [villeActuelle, setVilleActuelle] = useState('');
  const [villeDesiree, setVilleDesiree] = useState([]);
   

  useEffect(() => {
    fetch('https://tiny-worm-nightgown.cyclic.app/professeurs')
      .then(response => response.json())
      .then(data => {
        const professeurExemple = data[null];
        const uniqueGrades = [...new Set(data.map(professeur => professeur.grade))];
        const uniqueSpecialites = [...new Set(data.map(professeur => professeur.specialite))];
        setGrades(uniqueGrades);
        setSpecialites(uniqueSpecialites);
        setVilles([...new Set(data.flatMap(professeur => professeur.villeDesiree.split(';')))]);

        // Remplir les champs avec l'exemple de donnée
        setNom(professeurExemple.nom);
        setPrenom(professeurExemple.prenom);
        setTelephone(professeurExemple.tel);
        setEmail(professeurExemple.email);
        setMotDePasse(professeurExemple.password);
        setSpecialite(professeurExemple.specialite);
        setVilleActuelle(professeurExemple.villeFaculteActuelle);
        setVilleDesiree(professeurExemple.villeDesiree.split(';'));
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('https://tiny-worm-nightgown.cyclic.app/professeurs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Données du profil:', data);

          const loggedInProf = data.find(prof => prof.email === loggedInProfEmail);
          setProfileData(loggedInProf);
        } else {
          const error = await response.json();
          console.error('Erreur lors de la récupération des données du profil:', error.message);
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    fetchProfileData();
  }, [loggedInProfEmail]);

  useEffect(() => {
    if (profileData) {
      setGrade(profileData.grade);
      setSpecialite(profileData.specialite);
      setVilleActuelle(profileData.villeFaculteActuelle);
      setVilleDesiree(profileData.villeDesiree ? profileData.villeDesiree.split(';') : []);

    }
  }, [profileData]);
  
  
  const handleDeleteAccount = async () => {
  try {
    const response = await fetch(`https://tiny-worm-nightgown.cyclic.app/professeurs/${profileData.email}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      console.log('Compte supprimé avec succès');
      // Ajoutez ici votre logique pour rediriger ou effectuer d'autres actions après la suppression du compte
    } else {
      const error = await response.json();
      console.error('Erreur lors de la suppression du compte:', error.message);
    }
  } catch (error) {
    console.error('Erreur:', error);
  }
};



// Reste du code


  if (profileData) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
     <Button title="Supprimer" onPress={handleDeleteAccount}  color="red" />

        <Text>Nom: </Text>
        <TextInput
          style={styles.input}
          placeholder="Nom"
          value={profileData.nom}
          onChangeText={text => setNom(text)}
        />
        <Text>Prénom: </Text>
        <TextInput
          style={styles.input}
          placeholder="Prénom"
          value={profileData.prenom}
          onChangeText={text => setPrenom(text)}
        />
        <Text>Téléphone: </Text>
        <TextInput
          style={styles.input}
          placeholder="Téléphone"
          value={profileData.tel}
          onChangeText={text => setTelephone(text)}
        />
        <Text>Email: </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={profileData.email}
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
        />
        <Text>Mot de passe: </Text>
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={profileData.password}
          onChangeText={text => setMotDePasse(text)}
          secureTextEntry
        />
        <Text>Etablissement actuel:</Text>
        <TextInput
          style={styles.input}
          placeholder="Etablissement actuel"
          value={profileData.faculteActuelle}
          onChangeText={text => setVilleActuelle(text)}
        />
        <Text>Grade:</Text>
        <Picker
          style={styles.input}
          selectedValue={grade}
          onValueChange={value => setGrade(value)}
        >
          <Picker.Item label="Sélectionnez un grade" value="" />
          {grades.map((gradeItem, index) => (
            <Picker.Item key={index} label={gradeItem} value={gradeItem} />
          ))}
        </Picker>
        <Text>Spécialité :</Text>
        <Picker
          style={styles.input}
          selectedValue={specialite}
          onValueChange={value => setSpecialite(value)}
        >
          <Picker.Item label="Sélectionnez une spécialité" value="" />
          {specialites.map((specialiteItem, index) => (
            <Picker.Item key={index} label={specialiteItem} value={specialiteItem} />
          ))}
        </Picker>
        <Text>Ville actuelle :</Text>
        <Picker
          style={styles.input}
          selectedValue={villeActuelle}
          onValueChange={value => setVilleActuelle(value)}
        >
          <Picker.Item label="Sélectionnez une ville actuelle" value="" />
          {villes.map((villeItem, index) => (
            <Picker.Item key={index} label={villeItem} value={villeItem} />
          ))}
        </Picker>
        <MultipleSelect
  style={styles.input}
  items={villes.map((villeItem, index) => ({
    id: index.toString(),
    name: villeItem,
  }))}
  selectedItems={villeDesiree}
  onSelectedItemsChange={selectedItems => setVilleDesiree(selectedItems)}
  uniqueKey="id"
  displayKey="name"
  searchInputPlaceholderText={villeDesiree.length > 0 ? villeDesiree.join(', ') : "Rechercher des villes..."}
  tagRemoveIconColor="gray"
  tagBorderColor="gray"
  tagTextColor="gray"
  selectedItemTextColor="gray"
  selectedItemIconColor="gray"
  itemTextColor="black"
  searchInputStyle={{ color: 'gray' }}
  submitButtonColor="green"
  submitButtonText="Soumettre"
/>

      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Chargement...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default ProfileScreen;