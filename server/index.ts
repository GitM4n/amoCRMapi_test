import express, { Express, Request, Response } from "express";
import {cors} from 'cors-ts'
import { getLeads } from "./controllers/amoCRMget";



const app: Express = express();
const port = 5000;

app.use(express.json());
app.use(cors({
  origin:'*',
  credentials: true,
}))

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});


app.get('/api/leads', getLeads)

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});