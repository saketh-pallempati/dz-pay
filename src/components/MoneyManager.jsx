import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import TransactionItem from './TransactionItem'
import MoneyDetails from './MoneyDetails'
import './MoneyManager.css'
import { backend } from "../declarations/backend";
import ShopItem from './ShopItem';
export default function MoneyManager() {
  // const navigate = useNavigate();
  const { state } = useLocation();
  const { username } = state;
  const [balance, setBalance] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [income, setIncome] = useState(0);
  const [transactionsList, setTransactionsList] = useState([]);
  const [shops, setShops] = useState([]);

  useEffect(() => {
    async function fetchTransactions() {
      const ls = await backend.getTransactionHistoryOfUser(username);
      const balance = await backend.getBalance(username);
      let incomeTemp = 0;
      let expensesTemp = 0;
      ls.forEach(eachTransaction => {
        if (eachTransaction.from === username) {
          expensesTemp += eachTransaction.amount;
        } else {
          incomeTemp += eachTransaction.amount;
        }
      })
      setTransactionsList(ls);
      setBalance(balance);
      setExpenses(expensesTemp);
      setIncome(incomeTemp);
    }
    fetchTransactions();
  }, [username]);
  useEffect(() => {
    async function fetchShops() {
      const shops = await backend.listShops();
      setShops(shops);
    }
    fetchShops();
  }, [])
  async function addTransaction(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const recId = formData.get('recId');
    const recIdCheck = formData.get('recIdCheck');
    const amount = formData.get('amount');
    if (recId !== recIdCheck) {
      alert("Receiver Id does not match")
      return
    }
    if (amount < 0) {
      alert("Amount cannot be negative")
      return
    }
    await backend.transfer(username, recId, Number(amount));
    const res = await backend.getTransactionHistoryOfUser(username);
    setTransactionsList(res);
    let incomeTemp = 0;
    let expensesTemp = 0;
    res.forEach(eachTransaction => {
      if (eachTransaction.from === username) {
        expensesTemp += eachTransaction.amount;
      } else {
        incomeTemp += eachTransaction.amount;
      }
    })
    const balance = await backend.getBalance(username);
    setBalance(balance);
    setExpenses(expensesTemp);
    setIncome(incomeTemp);
  }
  return (
    <div className="app-container">
      <div className="responsive-container">
        <div className="header-container">
          <h1 className="heading">Hi, {username}</h1>
          <p className="header-content">
            Welcome back to your
            <span className="money-manager-text"> Dz Pay</span>
          </p>
        </div>
        <MoneyDetails
          balanceAmount={balance}
          incomeAmount={income}
          expensesAmount={expenses}
        />
        <div className="transaction-details">
          <form className="transaction-form" onSubmit={addTransaction}>
            <h1 className="transaction-header">Transfer Funds</h1>
            <label className="input-label" htmlFor="recId">
              Reciever Id
            </label>
            <input
              type="text"
              name='recId'
              id="recId"
              className="input"
              placeholder="Receiver Id"
            />
            <label className="input-label" htmlFor="recIdCheck">
              Re-enter Reciever Id
            </label>
            <input
              type="text"
              name='recIdCheck'
              id="recIdCheck"
              className="input"
              placeholder="Re-enter Receiver Id"
            />
            <label className="input-label" htmlFor="amount">
              AMOUNT
            </label>
            <input
              type="number"
              name='amount'
              id="amount"
              className="input"
              defaultValue={0}
            >
            </input>
            <button type="submit" className="button">
              Send
            </button>
          </form>
          <div className="history-transactions">
            <h1 className="transaction-header">Transaction History</h1>
            <div className="transactions-table-container">
              <ul className="transactions-table">
                <li className="table-header">
                  <p className="table-header-cell">Sender</p>
                  <p className="table-header-cell">Receiver</p>
                  <p className="table-header-cell">Time</p>
                  <p className="table-header-cell">Amount</p>
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
        </div>
        <div className='add-shop'>
          <h3>Shop List ( <i>Earnings</i> )</h3>
          <hr />

          <ul>
            {shops.map((shop, index) => <ShopItem key={index} shop={shop} />)}
          </ul>
        </div>
      </div>
    </div>
  )
}


