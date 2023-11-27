import './TransactionItem.css'

const TransactionItem = ({ sender, receiver, amount, time }) => {
  return (
    <li className="table-row">
      <p className="transaction-text">{sender}</p>
      <p className="transaction-text">{receiver}</p>
      <p className="transaction-text">{time}</p>
      <p className="transaction-text">Rs {amount}</p>
    </li>
  )
}

export default TransactionItem
