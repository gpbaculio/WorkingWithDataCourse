import {useEffect, useId, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import asyncAlert from './asyncAlert';
import sqliteDb from './sqliteDb';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {DynamicPressable} from 'src/components';
type CustomerType = {
  id?: string;
  uid: string;
  name: string;
};

export default function App() {
  const [textInputValue, setTextInputValue] = useState('');
  const [dialog, setDialog] = useState({
    customer: {},
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

  const hideDialog = (updatedCustomer: CustomerType) => {
    setDialog({
      isVisible: false,
      customer: {},
    });
    // 1. Set the new local customer state
    // 2. Create a SQL transaction to edit a customer. Make sure if two names are the same, only the selected item is deleted
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

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <Text style={styles.titleText}>Little Lemon Customers</Text>
        <TextInput
          placeholder="Enter the customer name"
          value={textInputValue}
          onChangeText={data => setTextInputValue(data)}
          underlineColorAndroid="transparent"
          style={styles.textInputStyle}
        />
        <TouchableOpacity
          disabled={!textInputValue}
          onPress={onSaveCustomerPress}
          style={styles.buttonStyle}>
          <Text style={styles.buttonTextStyle}> Save Customer </Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.customerName}>Customers: </Text>
          {customers.map((customer, index) => (
            <View style={styles.customer} key={`${id}-${index}`}>
              <Text style={styles.customerName}>{customer.name}</Text>
              <View style={styles.icons}>
                <DynamicPressable onPress={() => showDialog(customer)}>
                  <FontAwesome name="pencil" size={24} />
                </DynamicPressable>
                <DynamicPressable
                  ml="s"
                  onPress={() => deleteCustomer(customer)}>
                  <FontAwesome name="trash" size={24} />
                </DynamicPressable>
              </View>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  titleText: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingVertical: 20,
  },
  customer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customerName: {
    fontSize: 18,
  },
  buttonStyle: {
    fontSize: 16,
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    marginTop: 32,
    minWidth: 250,
    marginBottom: 16,
  },
  buttonTextStyle: {
    padding: 5,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  textInputStyle: {
    textAlign: 'center',
    height: 40,
    fontSize: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: 'green',
  },
  icons: {
    flexDirection: 'row',
  },
});
