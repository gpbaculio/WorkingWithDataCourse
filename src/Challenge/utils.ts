import {useRef, useEffect, EffectCallback, DependencyList} from 'react';

export const SECTION_LIST_MOCK_DATA = [
  {
    title: 'Appetizers',
    data: [
      {
        id: '1',
        title: 'Pasta',
        price: '10',
      },
      {
        id: '3',
        title: 'Pizza',
        price: '8',
      },
    ],
  },
  {
    title: 'Salads',
    data: [
      {
        id: '2',
        title: 'Caesar',
        price: '2',
      },
      {
        id: '4',
        title: 'Greek',
        price: '3',
      },
    ],
  },
];

type CategoryType = string | {title: string};

export type DataType = {
  id: number;
  uuid: string;
  title: string;
  price: string;
  category: CategoryType;
};

export type SectionDataType = {
  title: string;
  data: {id: number; title: string; price: string}[];
};

/**
 * 3. Implement this function to transform the raw data
 * retrieved by the getMenuItems() function inside the database.js file
 * into the data structure a SectionList component expects as its "sections" prop.
 * @see https://reactnative.dev/docs/sectionlist as a reference
 */
export const handleData = (data: DataType[]) =>
  data.reduce<SectionDataType[]>((acc, item) => {
    const title =
      typeof item?.category !== 'string'
        ? item?.category?.title
        : item?.category;

    let sec = acc.find(i => i?.title === title);

    const itemData = {id: item?.id, title: item?.title, price: item?.price};

    if (acc.length && sec) {
      return [
        ...acc.filter(a => a?.title !== sec?.title),
        {...sec, data: [...sec?.data, itemData]},
      ];
    }
    return [...acc, {title, data: [itemData]}];
  }, []);

export function getSectionListData(data: DataType[]) {
  // SECTION_LIST_MOCK_DATA is an example of the data structure you need to return from this function.
  // The title of each section should be the category.
  // The data property should contain an array of menu items.
  // Each item has the following properties: "id", "title" and "price"

  const sectionListData = handleData(data);
  return sectionListData;
}

export function useUpdateEffect(
  effect: EffectCallback,
  dependencies: DependencyList = [],
) {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      return effect();
    }
  }, dependencies);
}
