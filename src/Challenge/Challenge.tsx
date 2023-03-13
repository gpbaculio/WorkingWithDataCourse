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

const url =
  'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/menu-items-by-category.json';

type MenuType = {
  id: number;
  title: string;
  price: string;
  category: {
    title: string;
  };
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

  const [data, setData] = useState<MenuType[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = (await fetch(url).then(response => response.json())) as {
        menu: MenuType[];
      };
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

  const renderItem: ListRenderItem<MenuType> = ({item}) => (
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
        <FlatList<MenuType>
          contentContainerStyle={styles.contentContainer}
          ItemSeparatorComponent={Separator}
          keyExtractor={(i, index) => `${id}-${i.id}-${index}`}
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
