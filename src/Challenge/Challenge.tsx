import {useEffect, useId, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import asyncAlert from './asyncAlert';
import sqliteDb from './sqliteDb';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {
  DynamicPressable,
  DynamicText,
  DynamicTextInput,
  DynamicView,
} from 'src/components';
import useModal from 'store/hooks/useModal';
import Overlay from 'src/components/Overlay';

type CustomerType = {
  id?: string;
  uid: string;
  name: string;
};

type DialogType = {
  customer: CustomerType | null;
  isVisible: boolean;
};

export default function App() {
  const [textInputValue, setTextInputValue] = useState('');
  const [dialog, setDialog] = useState<DialogType>({
    customer: null,
    isVisible: false,
  });
  const [customers, setCustomers] = useState<CustomerType[]>([]);

  useEffect(() => {
    sqliteDb.transaction(tx => {
      tx.executeSql(
        'create table if not exists customers (id integer primary key not null, uid text, name text);',
      );
      tx.executeSql('select * from customers', [], (_, {rows}) => {
        const customers = rows.raw().map(item => ({
          id: item.id,
          uid: item.uid,
          name: item.name,
        }));
        setCustomers(customers);
      });
    });
  }, []);

  const showDialog = (customer: CustomerType) =>
    setDialog({
      isVisible: true,
      customer,
    });

  const hideDialog = (updatedCustomer?: CustomerType | null) => {
    setDialog({isVisible: false, customer: null});
    if (!updatedCustomer) {
      return;
    }
    // 1. Set the new local customer state
    setCustomers(prevCustomers => [
      ...prevCustomers.map(prevCustomer => {
        if (prevCustomer.uid === updatedCustomer.uid) {
          return updatedCustomer;
        }
        return prevCustomer;
      }),
    ]);
    // 2. Create a SQL transaction to edit a customer. Make sure if two names are the same, only the selected item is deleted
    sqliteDb.transaction(tx => {
      tx.executeSql(
        `update customers set name=? where uid=${updatedCustomer?.uid}`,
        [updatedCustomer?.name],
      );
    });
  };

  const deleteCustomer = async (customer: CustomerType) => {
    const shouldDelete = await asyncAlert({
      title: 'Delete customer',
      message: `Are you sure you want to delete the customer named "${customer.name}"?`,
    });
    if (!shouldDelete) {
      return;
    }
    // 1. Set the new local customer state
    setCustomers(prevCustomers => [
      ...prevCustomers.filter(c => c.id !== customer.id),
    ]);
    // 2. Create a SQL transaction to delete a customer. Make sure if two names are the same, only the selected item is deleted
    sqliteDb.transaction(tx => {
      tx.executeSql('delete from customers where id = ?', [customer.id]);
    });
  };

  const id = useId();

  const onSaveCustomerPress = () => {
    const newValue = {uid: Date.now().toString(), name: textInputValue};
    setCustomers([...customers, newValue]);
    sqliteDb.transaction(tx => {
      tx.executeSql('insert into customers (uid, name) values(?, ?)', [
        newValue.uid,
        newValue.name,
      ]);
    });
    setTextInputValue('');
  };

  const {actions} = useModal();

  useEffect(() => {
    if (dialog.isVisible) {
      actions.setShowModal(dialog.isVisible);
    }
  }, [dialog.isVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <DynamicView flex={1} padding="m" backgroundColor="white">
        <DynamicText
          fontSize={22}
          fontWeight="bold"
          textAlign="center"
          paddingVertical="xL">
          Little Lemon Customers
        </DynamicText>
        <DynamicTextInput
          placeholder="Enter the customer name"
          value={textInputValue}
          onChangeText={data => setTextInputValue(data)}
          underlineColorAndroid="transparent"
          variant="textInputStyle"
        />
        <DynamicPressable
          backgroundColor="#495E57"
          marginVertical="m"
          p="s"
          disabled={!textInputValue}
          onPress={onSaveCustomerPress}>
          <DynamicText fontSize={18} color="white" textAlign="center">
            Save Customer
          </DynamicText>
        </DynamicPressable>
        <View>
          <DynamicText fontSize={21} fontWeight="500" mb="m">
            Customers:
          </DynamicText>
          {customers.map((customer, index) => (
            <DynamicView
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
              key={`${id}-${index}-${customer.uid}`}>
              <DynamicText fontSize={18} fontWeight="500">
                {customer.name}
              </DynamicText>
              <DynamicView flexDirection="row">
                <DynamicPressable onPress={() => showDialog(customer)}>
                  <FontAwesome name="pencil" size={24} />
                </DynamicPressable>
                <DynamicPressable
                  ml="s"
                  onPress={() => deleteCustomer(customer)}>
                  <FontAwesome name="trash" size={24} />
                </DynamicPressable>
              </DynamicView>
            </DynamicView>
          ))}
        </View>
      </DynamicView>
      {dialog.isVisible && dialog.customer ? (
        <Overlay onPress={hideDialog}>
          <KeyboardAvoidingView style={styles.keyboard}>
            <DynamicText fontWeight="500" mb="s">
              Edit Customer name
            </DynamicText>
            <DynamicTextInput
              value={dialog.customer?.name}
              onChangeText={text =>
                setDialog(prev => ({
                  ...prev,
                  customer: {
                    ...(prev.customer as CustomerType),
                    name: text,
                  },
                }))
              }
              underlineColorAndroid="transparent"
              variant="textInputStyle"
            />
            <DynamicPressable
              mt="xs"
              backgroundColor="#495E57"
              onPress={() => {
                hideDialog(dialog.customer);
              }}>
              <DynamicText
                paddingVertical="xs"
                textAlign="center"
                color="white"
                fontWeight="500">
                Done
              </DynamicText>
            </DynamicPressable>
          </KeyboardAvoidingView>
        </Overlay>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    width: '60%',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  container: {flex: 1},
});
