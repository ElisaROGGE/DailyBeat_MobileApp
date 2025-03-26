import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import { useNavigation } from '@react-navigation/native';
import Navbar from '@/components/Navbar';

const Home = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedMusic, setSelectedMusic] = useState<any>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const navigation = useNavigation();

  // Fonction pour récupérer le profil utilisateur
  const getUserProfile = async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUserProfile(data);
      } else {
        console.error('Erreur récupération du profil:', data);
      }
    } catch (error) {
      console.error('Erreur réseau:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const code = new URLSearchParams(window.location.search).get('code');
      if (code) {
        const token = await exchangeCodeForToken(code);
        if (token) await getUserProfile(token);
      } else {
        console.error('Aucun code trouvé dans l’URL');
      }
    };
    fetchData();
  }, []);

  // Gestion du son avec expo-av
  const playSound = async () => {
    if (!selectedMusic?.preview_url) return;

    const { sound } = await Audio.Sound.createAsync(
      { uri: selectedMusic.preview_url },
      { shouldPlay: true }
    );
    setSound(sound);
  };

  useEffect(() => {
    return sound ? () => sound.unloadAsync() : undefined;
  }, [sound]);

  return (
    <View style={styles.container}>
      <Navbar />
      <Text style={styles.title}>Musique du Jour</Text>

      {selectedMusic ? (
        <View style={styles.musicCard}>
          <Image
            source={{ uri: selectedMusic.album.images[0]?.url }}
            style={styles.image}
          />
          <Text style={styles.songTitle}>
            {selectedMusic.name} - {selectedMusic.artists[0]?.name}
          </Text>

          {selectedMusic.preview_url ? (
            <TouchableOpacity style={styles.button} onPress={playSound}>
              <Text style={styles.buttonText}>Écouter un extrait</Text>
            </TouchableOpacity>
          ) : (
            <Text>Aucun extrait disponible pour cette piste.</Text>
          )}
        </View>
      ) : (
        <Text>Aucune musique sélectionnée pour aujourd'hui.</Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Beat')}
      >
        <Text style={styles.buttonText}>Add my daily beat</Text>
      </TouchableOpacity>
    </View>
  );
};

// 🎨 Styles pour l'interface
const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e1e',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  musicCard: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: 300,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 10,
  },
  songTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  button: {
    marginTop: 15,
    backgroundColor: '#1db954',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
};

export default Home;
