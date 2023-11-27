import { useState, useEffect } from 'react';
import { backend } from '../declarations/backend';
import ShopItem from './ShopItem';
const ShopList = () => {
    const [expenses, setExpenses] = useState([]);
    useEffect(() => {
        const fetchExpenses = async () => {
            const expenses = await backend.listShops();
            setExpenses(expenses);
        };
        fetchExpenses();
    }, []);

    return (
        <>
            {shops.map((shop, index) => <ShopItem key={index} shop={shop} />)}
        </>
    );
};

export default ShopList;