import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Svg, Circle, Path } from 'react-native-svg';

const getColorByIndex = (index) => {
  const colors = [
    '#81E73F',
    '#F5F05D',
    '#F9B141',
    '#36D6EC',
    '#A783D8',
    '#FC3143',
    '#8F00FF',
  ];
  return colors[index % colors.length];
};

export default function Accueil() {
  const [numProfsInscrits, setNumProfsInscrits] = useState(0);
  const [specialites, setSpecialites] = useState([]);
  const [villesDemandees, setVillesDemandees] = useState([]);
  const [numProfsParGrade, setNumProfsParGrade] = useState([]);

  useEffect(() => {
    fetch('https://tiny-worm-nightgown.cyclic.app/professeurs')
      .then((response) => response.json())
      .then((data) => {
        setNumProfsInscrits(data.length);
        setSpecialites(computeSpecialites(data));
        setVillesDemandees(computeVillesDemandees(data));
        setNumProfsParGrade(computeNumProfsParGrade(data));
      })
      .catch((error) => {
        console.error("Une erreur s'est produite lors de la récupération des données :", error);
      });
  }, []);

  const computeSpecialites = (data) => {
    const specialitesCount = {};
    data.forEach((prof) => {
      const specialite = prof.specialite;
      if (specialite in specialitesCount) {
        specialitesCount[specialite] += 1;
      } else {
        specialitesCount[specialite] = 1;
      }
    });
    return Object.entries(specialitesCount)
      .map(([label, value], index) => ({
        label,
        value,
        color: getColorByIndex(index),
      }))
      .sort((a, b) => b.value - a.value) // Tri par ordre décroissant du nombre de professeurs par spécialité
      .slice(0, 13); // Sélection des 15 premières spécialités
  };

  const computeVillesDemandees = (data) => {
    const villesCount = {};
    data.forEach((prof) => {
      const villeDemandee = prof.villeDesiree;
      if (villeDemandee in villesCount) {
        villesCount[villeDemandee] += 1;
      } else {
        villesCount[villeDemandee] = 1;
      }
    });

    return Object.entries(villesCount)
      .map(([label, value], index) => ({
        label,
        value,
        color: getColorByIndex(index),
      }))
      .sort((a, b) => b.value - a.value) // Trie par ordre décroissant du nombre de demandes
      .slice(0, 15); // Sélection des 15 premières villes
  };

  const computeNumProfsParGrade = (data) => {
    const gradesCount = {};
    data.forEach((prof) => {
      const grade = prof.grade;
      if (grade in gradesCount) {
        gradesCount[grade] += 1;
      } else {
        gradesCount[grade] = 1;
      }
    });
    return Object.entries(gradesCount).map(([label, value], index) => ({
      label,
      value,
      color: getColorByIndex(index),
    }));
  };

  const renderPieChart = (data) => {
    const radius = 80;
    const centerX = 100;
    const centerY = 100;

    let total = 0;
    data.forEach((item) => {
      total += item.value;
    });

    let startAngle = 0;
    const arcs = data.map((item, index) => {
      const endAngle = startAngle + (item.value / total) * 360;

      const x1 = centerX + radius * Math.cos((startAngle * Math.PI) / 180);
      const y1 = centerY + radius * Math.sin((startAngle * Math.PI) / 180);
      const x2 = centerX + radius * Math.cos((endAngle * Math.PI) / 180);
      const y2 = centerY + radius * Math.sin((endAngle * Math.PI) / 180);

      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

      const pathData = `M${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} L${centerX},${centerY}`;

      const arc = (
        <Path key={item.label} d={pathData} fill={item.color} />
      );

      startAngle = endAngle;

      return arc;
    });

    return (
      <Svg width="200" height="200">
        <Circle cx={centerX} cy={centerY} r={radius} fill="#ffffff" />
        {arcs}
      </Svg>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.title}>Accueil</Text>
        <Text style={styles.infoText}>Nombre de profs inscrits : {numProfsInscrits}</Text>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Nombre de profs par spécialité</Text>
          {renderPieChart(specialites)}
          <View style={styles.colorLegendContainer}>
            {specialites.map((item, index) => (
              <View key={index} style={styles.colorLegend}>
                <View style={[styles.colorIndicator, { backgroundColor: item.color }]}></View>
                <Text style={styles.colorLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Villes les plus demandées</Text>
          {villesDemandees.length > 0 ? (
            renderPieChart(villesDemandees)
          ) : (
            <Text>Aucune donnée disponible pour les villes demandées.</Text>
          )}
          <View style={styles.colorLegendContainer}>
            {villesDemandees.map((item, index) => (
              <View key={index} style={styles.colorLegend}>
                <View style={[styles.colorIndicator, { backgroundColor: item.color }]}></View>
                <Text style={styles.colorLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Nombre de profs par grade</Text>
          {renderPieChart(numProfsParGrade)}
          <View style={styles.colorLegendContainer}>
            {numProfsParGrade.map((item, index) => (
              <View key={index} style={styles.colorLegend}>
                <View style={[styles.colorIndicator, { backgroundColor: item.color }]}></View>
                <Text style={styles.colorLabel}>{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.statContainer}>
          <Text style={styles.statTitle}>Top 15 des spécialités</Text>
          {specialites.map((item, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
              
            </View>
            
          ))}
        </View><View style={styles.statContainer}>
  <Text style={styles.statTitle}>Villes les plus demandées (Top 15)</Text>
  {villesDemandees.slice(0, 15).map((item, index) => (
    <View key={index} style={styles.statItem}>
      <Text style={styles.statLabel}>{item.label}</Text>
      <Text style={styles.statValue}>{item.value}</Text>
    </View>
  ))}
</View>
  <View style={styles.statContainer}>
          <Text style={styles.statTitle}>Nombre de profs par grade</Text>
          {numProfsParGrade.map((item, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </View>
          ))}

        
        
      </View>
      </View>
      
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 16,
  },
  chartContainer: {
    marginBottom: 24,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  colorLegendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  colorLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  colorLabel: {
    fontSize: 14,
  },
  statContainer: {
    marginTop: 24,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 16,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
