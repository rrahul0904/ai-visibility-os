import { getStore } from "../../../../lib/store";
export async function GET(){ const store=await getStore(); return Response.json({data:await store.listCrawlerEvents()}); }
export async function POST(request){ const body=await request.json(); const required=["path","statusCode"]; const missing=required.filter(k=>body[k]===undefined); if(missing.length) return Response.json({error:`Missing: ${missing.join(", ")}`},{status:400}); return Response.json({accepted:true,event:{...body,id:crypto.randomUUID(),createdAt:new Date().toISOString()}},{status:202}); }
