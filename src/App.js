import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Om",
    image:
      "https://images.news18.com/ibnlive/uploads/2023/06/salman-khan-death-threat-from-goldy-brar.jpg",
    balance: -7,
  },
  {
    id: 933372,
    name: "Pawar",
    image:
      "https://i2.cinestaan.com/image-bank/1500-1500/107001-108000/107097.jpg",
    balance: 20,
  },
  {
    id: 499476,
    name: "Abhari",
    image:
      "https://cdn.asianmma.com/wp-content/uploads/2022/11/Disha-Patani-1024x683.jpg",
    balance: 0,
  },
];

export default function App() {
  const [openAddFriend, setOpenAddFriend] = useState(false);
  const [friendsList, setFriendsList] = useState(initialFriends);
  const [selectFriend, setSelectFriend] = useState(null);

  function handleAddFriend(friend) {
    setFriendsList((friendsList) => [...friendsList, friend]);
    setOpenAddFriend(false);
  }

  function handleSelectfriend(friend) {
    // setSelectFriend(friend);
    setSelectFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  function handleSplitBill(value) {
    setFriendsList((friendsList) =>
      friendsList.map((friend) =>
        friend.id === selectFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectFriend(null); 
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friends={friendsList}
          selectFriend={selectFriend}
          onSelect={handleSelectfriend}
        />

        {openAddFriend && <AddFriend openAddFriend={handleAddFriend} />}

        <Button onclick={() => setOpenAddFriend(!openAddFriend)}>
          {" "}
          {openAddFriend ? "close" : "Add Friend"}
        </Button>
      </div>

      {selectFriend && (
        <SplitBill selectFriend={selectFriend} onSplitBill={handleSplitBill} />
      )}
    </div>
  );
}

function FriendsList({ friends, onSelect, selectFriend }) {
  return (
    <>
      <ul>
        {friends.map((friend) => (
          <Friend
            friend={friend}
            key={friend.id}
            selectFriend={selectFriend}
            onSelect={onSelect}
          />
        ))}
      </ul>
    </>
  );
}

function Friend({ friend, onSelect, selectFriend }) {
  const isSelected = selectFriend?.id === friend.id;

  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          {" "}
          You Owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p> You and {friend.name} are even </p>}

      <Button onclick={() => onSelect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}

function AddFriend({ openAddFriend }) {
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    openAddFriend(newFriend);

    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  return (
    <>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>🙀Friend Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>🙀img url</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <Button>Add</Button>
      </form>
    </>
  );
}

function SplitBill({ selectFriend, onSplitBill }) {
  const [bill, setBill] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [billPayer, setBillPayer] = useState("user");

  const FriendExpense = bill ? bill - userExpense : "";

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !userExpense) return;

    onSplitBill(billPayer === "user" ? FriendExpense : -userExpense);
  }

  return (
    <>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        <h2>Split Bill with {selectFriend.name}</h2>

        <label>🤑 Bill Value</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />

        <label>🕺 Your Expense</label>
        <input
          type="text"
          value={userExpense}
          onChange={(e) => setUserExpense(Number(e.target.value))}
        />

        <label>👫 {selectFriend.name}'s Expense</label>
        <input type="text" disabled value={FriendExpense} />

        <label>💰 Who's paying the bill</label>
        <select
          value={billPayer}
          onChange={(e) => setBillPayer(e.target.value)}
        >
          <option value="user">You</option>
          <option value="friend">{selectFriend.name}</option>
        </select>

        <Button>Split Bill</Button>
      </form>
    </>
  );
}
