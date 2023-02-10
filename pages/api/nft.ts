import axios from "axios";

export default async function handler(req: any, res: any) {
  const { url } = req.query;
  try {
    const { data } = await axios.get(decodeURI(url));
    res.status(200).json(data.image);
  } catch (err) {
    res.status(200).json("");
  }
}
