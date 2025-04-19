import React, { useState } from 'react';
import { Modal, View, TextInput, Button, StyleSheet, Text } from 'react-native';

export default function AddMusicModal({ visible, onClose, onAddMusic }) {
  const [trackID, setTrackID] = useState('');
  const [trackName, setTrackName] = useState('');
  const [artist, setArtist] = useState('');

  const handleAddMusic = () => {
    if (trackID && trackName && artist) {
      onAddMusic({ trackID, trackName, artist });
      setTrackID('');
      setTrackName('');
      setArtist('');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.header}>Ajouter la musique du jour</Text>
          <TextInput
            placeholder="ID de la chanson"
            value={trackID}
            onChangeText={setTrackID}
            style={styles.input}
          />
          <TextInput
            placeholder="Nom de la chanson"
            value={trackName}
            onChangeText={setTrackName}
            style={styles.input}
          />
          <TextInput
            placeholder="Nom de l'artiste"
            value={artist}
            onChangeText={setArtist}
            style={styles.input}
          />
          <Button title="Ajouter Musique" onPress={handleAddMusic} />
          <Button title="Fermer" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  header: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
});
