import PocketBase from "pocketbase";

const pb = new PocketBase(process.env.REACT_APP_PBURL);

export default pb;
