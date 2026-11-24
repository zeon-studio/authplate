import { useState } from "react";

// how to use
// const { loadedItems, loadItemsHandler, loadItemsFinished } = useLoadMore(filteredWebsites,6,mounted);
// returns {loadedItems, loadItemsHandler, loadItemsFinished}

const useLoadMore = (
  items: Array<any>,
  loadPerClick: number,
  mounted: boolean,
) => {
  const [loadedCount, setLoadedCount] = useState<number>(loadPerClick);

  const loadItemsHandler = () => {
    setLoadedCount((prev) => prev + loadPerClick);
  };

  const loadedItems = mounted ? items.slice(0, loadedCount) : [];
  const loadItemsFinished = Number(items.length) <= Number(loadedItems.length);

  return {
    loadedItems,
    loadItemsHandler,
    loadItemsFinished,
  };
};

export default useLoadMore;
