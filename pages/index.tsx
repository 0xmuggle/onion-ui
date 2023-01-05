import { Button } from "components/Common";
import type { NextPage } from "next";
import flips from "service/flips";

const Home: NextPage = () => {
  const loadData = () => {
    flips('0x9aF5209dE69226ee9dafD7Ed34C61d97BDee6c7B');
  }
  return (
    <main>
      <Button onClick={loadData}>Main</Button>
    </main>
  );
};

export default Home;
