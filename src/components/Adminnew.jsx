import { useEffect, useState } from "react";
import { backend } from "../declarations/backend";
import ShopItem from "./ShopItem";
function Admin() {
    const [balance, setBalance] = useState(0);
    const [shops, setShops] = useState([]);
    const [amount, setAmount] = useState(0);
    const [transactionsList, setTransactionsList] = useState([]);
    useEffect(() => {
        async function fetchTransactions() {
            const ls = await backend.getTransactionHistory();
            setTransactionsList(ls);
        }
        async function fetchShops() {
            const shops = await backend.listShops();
            setShops(shops);
        }
        async function fetchBalance() {
            const bal = await backend.getBalance("admin");
            setBalance(bal);
        }
        fetchTransactions();
        fetchShops();
        fetchBalance();
    }, [])
    const handleAddBalance = async (event) => {
        event.preventDefault();
        await backend.init(Number(amount));
        let bal = await backend.getBalance("admin");
        setBalance(bal);
    };
    const handleAddShop = async (event) => {
        event.preventDefault();
        const shop = event.target.elements.shop.value;
        await backend.addShop(shop);
        const shops = await backend.listShops();
        setShops(shops);
    };

    return (
        <div>
            <h1>Admin</h1>
            <h2>Balance: {balance}</h2>
            <form onSubmit={handleAddBalance}>
                <input type="number" name="amount" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
                <button type="submit">Add Balance</button>
            </form>
            <h2>Shops</h2>
            <ul>
                {shops.map((shop, index) => <ShopItem key={index} shop={shop} />)}
            </ul>
            <form onSubmit={handleAddShop}>
                <input type="text" name="shop" placeholder="Shop" />
                <button type="submit">Add Shop</button>
            </form>
            <div className="history-transactions">
                <h1 className="transaction-header">Transaction History</h1>
                <div className="transactions-table-container">
                    <ul className="transactions-table">
                        <li className="table-header">
                            <p className="table-header-cell">Sender</p>
                            <p className="table-header-cell">Receiver</p>
                            <p className="table-header-cell">Amount</p>
                            <p className="table-header-cell">Date</p>
                        </li>
                        {transactionsList.map(eachTransaction => {
                            let milliseconds = Number(eachTransaction.time.toString()) / 1000000;
                            let date = new Date(milliseconds);
                            let isoString = date.toISOString();
                            let [datePart, timePart] = isoString.split('T');
                            let timeWithoutMilliseconds = timePart.split('.')[0];
                            let dateTimeString = datePart + ' ' + timeWithoutMilliseconds;

                            return (
                                <TransactionItem
                                    key={dateTimeString}
                                    sender={eachTransaction.from}
                                    amount={eachTransaction.amount}
                                    receiver={eachTransaction.to}
                                    time={dateTimeString}
                                />
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div >
    );
}

export default Admin;