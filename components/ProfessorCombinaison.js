import React, { useState, useEffect } from 'react';
import { View, StyleSheet ,Text} from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { Picker } from '@react-native-picker/picker';

const API_URL = 'https://tiny-worm-nightgown.cyclic.app/professeurs';

const Combinaison = () => {
  const [professors, setProfessors] = useState([]);
  const [selectedSpeciality, setSelectedSpeciality] = useState('');
  const [specialites, setSpecialites] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const jsonData = await response.json();
      setProfessors(jsonData);

      const uniqueSpecialites = [...new Set(jsonData.map((item) => item.specialite))];
      setSpecialites(uniqueSpecialites);
    } catch (error) {
      console.error(error);
    }
  };

  const filterProfessorsBySpeciality = () => {
    if (selectedSpeciality === '') {
      return professors;
    }
    return professors.filter((professor) => professor.specialite === selectedSpeciality);
  };

  const renderNodes = () => {
    const filteredProfessors = filterProfessorsBySpeciality();

    return filteredProfessors.map((professor, index) => {
      // Generate random positions for the nodes
      const cx = Math.random() * 300 + 50;
      const cy = Math.random() * 300 + 50;

      // Generate random colors for the circles
      const colors = ['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#FFFF00', '#00FFFF'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];

      return (
        <Circle
          key={index}
          cx={cx}
          cy={cy}
          r={20}
          fill={randomColor}
        />
      );
    });
  };

  const handleSpecialityChange = (value) => {
    setSelectedSpeciality(value);
  };

  return (
    <View style={styles.container}>
      <Text>Spécialité :</Text>
      <Picker
        selectedValue={selectedSpeciality}
        onValueChange={handleSpecialityChange}
      >
        <Picker.Item label="Toutes les spécialités" value="" />
        {specialites.map((specialite, index) => (
          <Picker.Item key={index} label={specialite} value={specialite} />
        ))}
      </Picker>
      <Svg width="100%" height="100%">
        {renderNodes()}
      </Svg>
    </View>
  );
};
<Text> les boules représentes les professeurs par spécialité</Text>
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Combinaison;
