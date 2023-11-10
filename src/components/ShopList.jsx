import { useState, useEffect } from 'react';
import { backend } from '../declarations/backend';
import ShopItem from './ShopItem';
const shopList = () => {
    const [expenses, setExpenses] = useState([]);
    useEffect(() => {
        const fetchExpenses = async () => {
            const expenses = await backend.listShops();
            setExpenses(expenses);
        };

        fetchExpenses();
    }, []);
    const [filteredExpenses, setfilteredExpenses] = useState(expenses || []);

    useEffect(() => {
        setfilteredExpenses(expenses);
    }, [expenses]);

    const handleChange = (event) => {
        const searchResults = expenses.filter((filteredExpense) =>
            filteredExpense.name.toLowerCase().includes(event.target.value)
        );
        setfilteredExpenses(searchResults);
    };

    const styles = {
        searchBar: {
            border: '3px solid #3498db',
            borderRadius: '5px',
            padding: '8px 10px',
            fontSize: '16px',
            color: '#333',
            backgroundColor: '#f2f2f2',
            width: '100%',
        },
    };


    return (
        <>
            <input
                type='text'
                style={styles.searchBar}
                placeholder='Type to search...'
                onChange={handleChange}
            />
            <ul className='list-group mt-3 mb-3'>
                {filteredExpenses.map((expense) => {
                    const cost = backend.getBalance(expense);
                    return (
                        <ShopItem
                            id={expense}
                            name={expense}
                            cost={cost}
                        />)
                }
                )}
            </ul>
        </>
    );
};

export default shopList;