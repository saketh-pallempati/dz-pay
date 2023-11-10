import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Buffer "mo:base/Buffer";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

actor {
  type User = {
    id : Text;
    name : Text;
    var balance : Float;
    password : Text;
  };

  type Transaction = {
    from : Text;
    to : Text;
    amount : Float;
    time : Time.Time;
  };

  let userbase = HashMap.HashMap<Text, Text>(0, Text.equal, Text.hash);

  public func registerUser(username : Text, password : Text) : async Bool {
    switch (userbase.get(username)) {
      case (?user) {
        return false;
      };
      case (null) {
        let temp = {
          id = username;
          name = username;
          var balance : Float = 0;
          password = password;
        };
        balances.put(username, temp);
        userbase.put(username, password);
        return true;
      };
    };
  };

  public query func verifyuser(username : Text, password : Text) : async Text {
    switch (userbase.get(username)) {
      case (?user) {
        if (user == password) {
          return "Success";
        };
        return "Not Success";
      };
      case (null) {
        return ("User don't exist");
      };
    };
  };

  var balances : HashMap.HashMap<Text, User> = HashMap.HashMap<Text, User>(10, Text.equal, Text.hash);
  var transactions : Buffer.Buffer<Transaction> = Buffer.Buffer<Transaction>(10);
  var shops = Buffer.Buffer<Text>(10);
  public func init(val : Float) : async () {
    var old = await getBalance("admin");
    if (old == -1) {
      old := 0;
    };
    let new = old + val;
    let temp = {
      id = "admin";
      name = "admin";
      var balance = new;
      password = "admin";
    };
    balances.put("admin", temp);
  };

  public func addShop(shopName : Text) : async Bool {
    shops.add(shopName);
    await registerUser(shopName, "admin");
  };

  public query func listShops() : async [Text] {
    return Buffer.toArray(shops);
  };

  public query func getBalance(userId : Text) : async Float {
    let current : ?User = balances.get(userId);
    return switch (current) {
      case (?user) { user.balance };
      case (null) { -1 };
    };
  };

  public func transfer(senderId : Text, receiverId : Text, amount : Float) : async () {
    let senderBalance : Float = await getBalance(senderId);
    let receiverBalance : Float = await getBalance(receiverId);
    if (senderBalance == -1 or receiverBalance == -1) {
      return;
    };
    let sender = balances.get(senderId);
    let receiver = balances.get(receiverId);
    if (senderBalance < amount) {
      // throw Error("Insufficient balance");
      return;
    };
    switch (sender, receiver) {
      case (?senderUser, ?receiverUser) {
        senderUser.balance := senderUser.balance - amount;
        receiverUser.balance := receiverUser.balance + amount;
      };
      case _ {
        // throw Error("User does not exist");
      };
    };
    let transaction = {
      from = senderId;
      to = receiverId;
      amount = amount;
      time = Time.now();
    };
    transactions.add(transaction);

  };
  public query func getTransactionHistory() : async [Transaction] {
    return Buffer.toArray(transactions);
  };
  public query func getTransactionHistoryOfUser(userId : Text) : async [Transaction] {
    let transactionsArray = Buffer.toArray(transactions);
    let filteredTransactionsArray = Array.filter<Transaction>(
      transactionsArray,
      func(transaction : Transaction) : Bool {
        return transaction.from == userId or transaction.to == userId;
      },
    );
    return filteredTransactionsArray;
  };
};
