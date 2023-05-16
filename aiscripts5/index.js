import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";


export default function Home() {
  const [objectiveInput, setObjectiveInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ objective: objectiveInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setObjectiveInput("");
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Systems Engineer Bot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>LLM-based System Engineer</h1>
        <p className={styles.description}>Enter a system objective to start</p>
        <form onSubmit={onSubmit} className={styles.form}>
          <input
            type="text"
            name="objective"
            placeholder="System objective"
            value={objectiveInput}
            onChange={(e) => setObjectiveInput(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>
            Generate System
          </button>
        </form>
        <div className={styles.result} dangerouslySetInnerHTML={{ __html: result }}></div>
      </main>
    </div>
    
  );
}
