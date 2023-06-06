import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button } from 'react-native';
import MultipleSelect from 'react-native-multiple-select';
import { Picker } from '@react-native-picker/picker';

const Inscription = () => {
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
        setGrade(professeurExemple.grade);
        setSpecialite(professeurExemple.specialite);
        setVilleActuelle(professeurExemple.villeFaculteActuelle);
        setVilleDesiree(professeurExemple.villeDesiree.split(';'));
      })
      .catch(error => {
        console.log('Error fetching data:', error);
      });
  }, []);

  const validateFields = () => {
    // Ajoutez ici la logique de validation des champs
    // Renvoyez true si tous les champs sont valides, sinon false
    return true;
  };

  const addProfessor = async () => {
    if (!validateFields()) {
      return;
    }

    try {
      const response = await fetch('https://tiny-worm-nightgown.cyclic.app/professeurs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: nom,
          prenom: prenom,
          tel: telephone,
          email: email,
          grade: grade,
          specialite: specialite,
          faculteActuelle: villeActuelle,
          villeFaculteActuelle: villeActuelle,
          villeDesiree: villeDesiree.join(';'),
          password: motDePasse,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Professor added successfully:', data);
      } else {
        const error = await response.json();
        console.error('Failed to add professor:', error.message);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleInscription = () => {
    addProfessor();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={nom}
        onChangeText={text => setNom(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={prenom}
        onChangeText={text => setPrenom(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Téléphone"
        value={telephone}
        onChangeText={text => setTelephone(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={motDePasse}
        onChangeText={text => setMotDePasse(text)}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Etablissement actuel"
        value={villeActuelle}
        onChangeText={text => setVilleActuelle(text)}
      />
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
        searchInputPlaceholderText="Rechercher des villes..."
        tagRemoveIconColor="black"
        tagBorderColor="black"
        tagTextColor="black"
        selectedItemTextColor="black"
        selectedItemIconColor="black"
        itemTextColor="black"
        searchInputStyle={{ color: 'black' }}
        submitButtonColor="black"
        submitButtonText="Soumettre"
      />
      <Button title="S'inscrire" onPress={addProfessor} color="blue" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
});

export default Inscription;