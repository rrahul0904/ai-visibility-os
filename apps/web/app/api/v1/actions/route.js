import { getStore } from "../../../../lib/store";
export async function GET(){ const store=await getStore(); return Response.json({data:await store.listActions()}); }
