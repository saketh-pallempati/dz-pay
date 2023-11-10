import { useState, useEffect } from 'react';
import { backend } from "../declarations/backend";

const ShopItem = (props) => {
  const [cost, setCost] = useState(0);
  const styles = {
    listItem: {
      display: 'flex',
      justifyContent: 'space-between',
      backgroundColor: '#f9f9f9',
      padding: '10px',
      margin: '2px 0',
      borderRadius: '5px',
    },
    name: {
      flex: '1',
      marginRight: '1rem',
      fontWeight: 'bold',
    },
    cost: {
      flex: '1',
      marginRight: '1rem',
      textAlign: 'center',
      color: '#3498db',
      fontWeight: 'bold',
    },
  };

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await backend.getBalance(props.shop);
      setCost(balance);
    };

    fetchBalance();
  }, [props.shop]);

  return (
    <li style={styles.listItem}>
      <div style={styles.name} >{props.shop}</div>
      <div style={styles.cost}>₹{cost}</div>
    </li>
  );
};

export default ShopItem;