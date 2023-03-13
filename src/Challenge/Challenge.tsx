import {
  FlatList,
  ListRenderItem,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import React, {useEffect, useId, useState} from 'react';
import Header from './Header';
import {DynamicText, DynamicView} from 'src/components';
import useLogData from './useLogData';
import menuItems from 'menuitems.json';

type MenuItem = {
  title: string;
  price: string;
};

const Separator = () => (
  <DynamicView
    height={1}
    marginVertical="m"
    width="100%"
    backgroundColor="#f5f5f5"
  />
);

const Challenge = () => {
  const id = useId();

  const [data, setData] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      const data = menuItems;
      useLogData(data);
      setData(data.menu);
    } catch (e) {
      console.warn(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem: ListRenderItem<MenuItem> = ({item}) => (
    <DynamicView flexDirection="row" justifyContent="space-between">
      <DynamicText fontSize={18} fontWeight="500" color="#DAFB61">
        {item.title}
      </DynamicText>
      <DynamicText fontSize={18} fontWeight="500" color="#DAFB61">
        ${item.price}
      </DynamicText>
    </DynamicView>
  );

  return (
    <DynamicView flex={1} backgroundColor="#495E57">
      <Header />
      {loading ? (
        <ActivityIndicator />
      ) : (
        <FlatList<MenuItem>
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={Separator}
          keyExtractor={(_, index) => `${id}-${index}`}
          data={data}
          renderItem={renderItem}
        />
      )}
    </DynamicView>
  );
};

export default Challenge;

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 40,
    paddingTop: 20,
  },
});
