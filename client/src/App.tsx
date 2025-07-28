import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import CounterABI from "./Counter.json";
import './App.css';


const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // atualize!
const privateKey = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"; // atualize!

const App: React.FC = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState("");
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    const init = async () => {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const wallet = new ethers.Wallet(privateKey, provider);
      const instance = new ethers.Contract(contractAddress, CounterABI.abi, wallet);

      setContract(instance);

      const name = await instance.getName();
      const count = await instance.getCount();
      setName(name);
      setCount(Number(count));
    };

    init();
  }, []);

  const increment = async () => {
    if (!contract) return;
    const tx = await contract.increment();
    await tx.wait();
    const newCount = await contract.getCount();
    setCount(Number(newCount));

    if (Number(newCount) >= 5) {
      alert("🎉 Parabéns! Você atingiu 5 incrementos!");
    }
  };

  const decrement = async () => {
    if (!contract) return;
    const tx = await contract.decrement();
    await tx.wait();
    const newCount = await contract.getCount();
    setCount(Number(newCount));
  };

  const reset = async () => {
    if (!contract) return;
    const tx = await contract.reset();
    await tx.wait();
    const newCount = await contract.getCount();
    setCount(Number(newCount));
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Contador Inteligente</h1>
      <h2>Desenvolvido por: {name}</h2>
      <p>Valor atual: {count}</p>
      <button onClick={increment}>➕ Incrementar</button>
      <button onClick={decrement}>➖ Decrementar</button>
      <button onClick={reset}>🔄 Resetar</button>
    </div>
  );
};

export default App;
