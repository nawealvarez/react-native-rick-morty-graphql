import { useQuery } from '@apollo/client';
import { RouteProp, useRoute } from '@react-navigation/native';
import React from 'react';
import { View, Text, ActivityIndicator, Image, FlatList } from 'react-native';
import { FETCH_CHARACTER_DETAILS } from '../../apollo/Queries';
import { CharacterQueryType } from '../../apollo/Types';
import { COLORS, STRINGS } from '../../common';
import { EpisodeCard } from '../../components';
import { MainStackParams } from '../../navigation/MainStack';
import styles from './styles';
const CharacterDetails = () => {
  const { params } = useRoute<RouteProp<MainStackParams, 'CharacterDetails'>>();
  const { loading, data, error } = useQuery<CharacterQueryType>(FETCH_CHARACTER_DETAILS, {
    variables: {
      id: params.id,
    },
  });

  if (error) {
    return null;
  }
  if (loading) {
    return <ActivityIndicator style={styles.indicator} size="large" color={COLORS.koromike} />;
  }

  const isDead = data?.character.status === 'Dead';

  const ListHeaderComponent = () => (
    <View>
      <Image source={{ uri: data?.character.image }} style={styles.image} />
      <View style={styles.nameWithStatus}>
        <View style={[styles.status, isDead ? styles.deadStatus : null]} />
        <Text style={styles.name}>{data?.character.name}</Text>
        <Text style={[styles.statusText, isDead ? styles.deadStatusText : null]}>
          ( {data?.character.status} )
        </Text>
      </View>
      <Text style={styles.infoText}>
        ( {`${data?.character.species} - ${data?.character.gender}`} )
      </Text>
      <View style={styles.separator} />
      <Text
        style={
          styles.episodesHeaderText
        }>{`${STRINGS.episodes} (${data?.character.episode?.length})`}</Text>
    </View>
  );
  return (
    <FlatList
      ListHeaderComponent={ListHeaderComponent}
      data={data?.character.episode}
      contentContainerStyle={styles.container}
      renderItem={({ item, index }) => (
        <EpisodeCard index={index} name={item.name} air_date={item.air_date} />
      )}
    />
  );
};

export default CharacterDetails;
